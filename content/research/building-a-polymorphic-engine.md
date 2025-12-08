---
title: "MalDev Logs: Building a Polymorphic Engine in Go"
date: 2025-12-08
draft: false
description: "Why simple hash mutation failed me, and how I used Go's AST to build a true polymorphic compiler."
tags: ["MalDev", "Go", "Red Team", "Engineering"]
---

## The "Make" Trick (And Why It Failed)

In early tests with my agent, I tried the lazy way to evade static analysis: changing the file hash at build time. I used a simple Makefile trick to inject a random `BUILD_ID` string into the binary metadata.

```makefile
# The "Script Kiddie" approach
LDFLAGS := -X main.buildID=$(shell openssl rand -hex 8)
go build -ldflags="$(LDFLAGS)" -o agent.exe
```

**Plot Twist**

It didn't work. While the MD5 hash changed, the actual *code structure* was identical. The `.text` section retained the exact same entropy and byte sequence. Consequently, the Control Flow Graph (CFG) looked exactly the same in Ghidra, meaning a single YARA rule matching the function body caught every "unique" build instantly.

Renaming a file isn't polymorphism. I needed to change the code itself.

## Mutating the Source Tree

I avoided regex or unstable string replacement scripts to modify the code because they are too prone to syntax errors. I needed to manipulate the code the way the compiler sees it: as an **Abstract Syntax Tree (AST)**.

My goal was to build a pre-compiler tool that rewrites the Go source code logic before the binary is built. This required three distinct steps: altering the structure, hiding the data, and injecting the decryption logic.

### 1\. Reverse Engineering the Compiler's View

First, I had to understand what Go code looks like as a data structure. I wrote a script to dump the AST of a simple assignment: `_ = 1 + 2`.

**The Target Logic:**

```go
func hello() string {
    _ = 1 + 2 // I want to inject this anywhere
    return "done"
}
```

**The AST Dump:**

```bash
2: *ast.AssignStmt {
   .  Lhs: [0: *ast.Ident { Name: "_" }]
   .  Tok: =
   .  Rhs: [0: *ast.BinaryExpr {
   .  .  .  X: { Kind: INT, Value: "1" }
   .  .  .  Op: +
   .  .  .  Y: { Kind: INT, Value: "2" }
   .  }]
}
```

This dump became the blueprint. I wasn't writing text anymore; I was constructing struct objects that represented code.

### 2\. Breaking the Hash: Junk Injection

The first step to changing the binary signature is altering the byte offsets of the functions. To do this, I wrote a generator that inserts randomized arithmetic operations.

(Crude implementation, I know. It could be done in an easier way. But for conceptualization on a granular level, I prefer this way.)

```go
// Generates: _ = <RAND> <OP> <RAND>
func generateJunk() ast.Stmt {

    allowedTokens := []token.Token{token.ADD, token.SUB, token.MUL}

    lhs := []ast.Expr{
        &ast.Ident{
            // the token has not position hence token.NoPos
            NamePos: token.NoPos,
            Name:    "_",
        },
    }
    rhs := []ast.Expr{
        &ast.BinaryExpr{
            X: &ast.BasicLit{
                ValuePos: token.NoPos,
                Kind:     token.INT,
                Value:    strconv.Itoa(rand.IntN(1000)),
            },
            OpPos: token.NoPos,
            Op:    allowedTokens[(rand.IntN(len(allowedTokens)))],
            Y: &ast.BasicLit{
                ValuePos: token.NoPos,
                Kind:     token.INT,
                Value:    strconv.Itoa(rand.IntN(1000)),
            },
        },
    }
    stm := &ast.AssignStmt{
        Lhs:    lhs,
        TokPos: token.NoPos,
        Tok:    token.ASSIGN,
        Rhs:    rhs,
    }

    return stm
}
```

I didn't just dump this math into the function body, as the compiler might optimize it away as dead code. Instead, I wrapped this junk code in an **Opaque Predicate**—a conditional like `if 1==1` that always evaluates to true. This forces the decompiler to draw a branching graph, effectively changing the visual signature of the function in reverse engineering tools.

### 3\. Killing String Signatures

Junk code handles the structure, but cleartext strings like `"cmd.exe"` are still visible to `strings` or YARA. I needed to find every string and encrypt it.

I used `golang.org/x/tools/go/ast/astutil` to walk the tree. My first attempt was a disaster—I tried to blindly replace *every* string literal I found. This caused the compiler to panic because I accidentally tried to mutate `import "fmt"` into `import xor("fmt")`. In Go's AST, import paths are rigid types, not flexible expressions.

I fixed this by filtering the walker to ignore `ImportSpec` nodes and only target strings in "Expression" contexts.

**The Walker Logic:**

1.  Find `*ast.BasicLit` nodes where `Kind == STRING`.
2.  Ignore them if the parent is an `import`.
3.  XOR encrypt the string value.
4.  Replace the string literal with a function call: `xor("encrypted_blob")`.

```go
astutil.Apply(node, func(c *astutil.Cursor) bool {
    // ... ingoring Imports ...
    
    // swapping xor
    newCall := &ast.CallExpr{
        Fun: ast.NewIdent("xor"),
        Args: []ast.Expr{
            &ast.BasicLit{ Value: fmt.Sprintf("%q", encrypted) },
        },
    }
    c.Replace(newCall)
    return true
}, nil)
```

### 4\. Making It Portable

We have successfully mutated the strings into `xor(...)` calls, but the target code doesn't actually *have* an `xor` function yet. If we tried to build it now, it would fail.

I wrote an injector that parses a template string of the `xor` helper function and grafts the entire `*ast.FuncDecl` onto the bottom of the target file's AST programmatically. This makes the malware self-contained.

## The Verdict

I ran the mutator against a sample agent three times to generate three variants.

**The Source Transformation:**

Here is how the pieces combine. The engine injected Opaque Predicates (Step 2), wrapped the strings (Step 3), and injected the helper (Step 4).

```go
func hello() string {
    // Step 3: Strings are now hidden
    message := xor("\xc2\xcf\xc6...") 
    
    // Step 2: Junk code changes the stack frame
    if 1 == 1 {
        _ = 552 + 256
    } else {
        _ = 250 + 715
    }

    return message
}

// Step 4: The injected helper
func xor(input string) string { ... }
```

**The Proof:**

Comparing the build artifacts shows three mathematically distinct binaries with identical behavior.

```bash
$ sha256sum agent_*
e84808...1af *agent_1.exe
79e3f2...759 *agent_2.exe
89edec...11e *agent_3.exe
```

## Closing Thoughts

This experiment proved that true polymorphism requires shifting the byte-level structure of the binary. By treating source code as a data structure rather than text, we can generate functionally identical but structurally unique variants for every deployment.

If you want to beat modern EDR, stop writing Makefiles and start writing compiler middleware.
