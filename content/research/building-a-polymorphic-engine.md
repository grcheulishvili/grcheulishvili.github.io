---
title: "Polymorphic Engine Development"
date: 2025-12-08
draft: false
description: "Analysis of dynamic code mutation in Go to bypass static signature detection."
tags: ["MalDev", "Go", "Red Team"]
---

## The "Make" Trick (And Why It Failed)

My initial approach to evading static analysis was rudimentary and entry-level. I used a simple Makefile trick to inject a random `BUILD_ID` string into the binary metadata at compile time, which would alter the binary's hash.

```makefile
# The "Script Kiddie" approach
LDFLAGS := -X main.buildID=$(shell openssl rand -hex 8)
go build -ldflags="$(LDFLAGS)" -o agent.exe # Build with new metadata to change the hash

```

**Spoiler**

It didn't work. While the hash changed, the actual code structure remained identical. The `.text` section retained the exact same entropy and byte sequence. Consequently, the Control Flow Graph (CFG) looked exactly the same in Ghidra. This meant a single YARA rule matching the function body caught every "unique" build instantly.

Renaming a file or appending useless metadata isn't polymorphism. I needed to change the code itself before compilation.

## Code Mutation

Regex and string replacement scripts are too fragile for code mutation because they easily break syntax. To do this right, I had to manipulate the code the way the compiler sees it: as an **Abstract Syntax Tree (AST)**.

My goal was to build a pre-compiler tool that rewrites the Go source code logic before the binary is built. This required three distinct steps: altering the structure, hiding the data, and injecting the decryption logic.

### 1. Reverse Engineering the Compiler's View

First, I had to understand what Go code looks like as a data structure. I wrote a script to dump the AST of a simple assignment `_ = 1 + 2` inside a function.

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

This dump became my blueprint. Instead of just modifying text, my objective shifted to manipulating objects and structures that collectively represent the code.

### 2. Improving the First Version: Junk Code Injection

The first step to changing the binary signature is altering the byte offsets of the functions. To do this, I built a generator that inserts randomized arithmetic operations. I know the function below is a crude implementation, but to grasp the process on a granular level, I prefer manual struct construction over relying completely on helper packages.

```go
// Generates: _ = <RAND> <OP> <RAND> : e.g., _ = 1 + 3
func generateJunk() ast.Stmt {
    allowedTokens := []token.Token{token.ADD, token.SUB, token.MUL}

    lhs := []ast.Expr{
        &ast.Ident{ NamePos: token.NoPos, Name: "_" },
    }
    rhs := []ast.Expr{
        &ast.BinaryExpr{
            X: &ast.BasicLit{
                Kind:  token.INT,
                Value: strconv.Itoa(rand.IntN(1000)),
            },
            Op: allowedTokens[(rand.IntN(len(allowedTokens)))],
            Y: &ast.BasicLit{
                Kind:  token.INT,
                Value: strconv.Itoa(rand.IntN(1000)),
            },
        },
    }
    return &ast.AssignStmt{
        Lhs: lhs, 
        Tok: token.ASSIGN, 
        Rhs: rhs,
    }
}

```

I didn't just dump these arithmetic operations into the function body, as the compiler might optimize them away as dead code. Instead, I wrapped this generated code in an **Opaque Predicate**```-a conditional like `if 1==1` that always evaluates to true. This forces the decompiler to draw a branching structure, effectively changing the visual signature of the function in reverse engineering tools.

### 3. Destroying Embedded String Signatures

Junk code handles the structure, but cleartext strings like `"cmd.exe"` are still visible to `strings` or YARA. I needed to locate every string and encrypt it to evade these detection mechanisms.

I used the `golang.org/x/tools/go/ast/astutil` package to traverse the AST. My first attempt failed because I tried to blindly replace every string literal I encountered. This caused a compiler error because I accidentally mutated an import statement like `import "fmt"` into `import xor("fmt")`. In Go's AST, import paths are rigid types, not flexible expressions.

I fixed this by filtering the walker to ignore `ImportSpec` nodes, targeting only strings within expression contexts. I then swapped the string node with a `xor("encrypted_blob")` function call.

```go
astutil.Apply(node, func(c *astutil.Cursor) bool {
    // Import evasion logic...
    
    // Replacing with xor function
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

### 4. Portability and Injection

We successfully replaced the strings with `xor` calls, but the target code doesn't actually have this function yet. If we tried to build it now, compilation would fail. Consider this obfuscated example:

```go
func hello() string {
    // Strings are now hidden
    message := xor("\xc2\xcf\xc6...") 
}

```

We are calling a `xor()` function that does not exist in this specific file. How is the compiler supposed to resolve this function to decrypt the text and output the data correctly at runtime?

To solve this, I wrote an injector that parses a template of the `xor` helper function and programmatically appends the entire `*ast.FuncDecl` object to the bottom of the target file's AST. This makes the malware completely autonomous and self-contained.

## The Verdict

I ran the mutator against a sample agent three times to generate three distinct variants.

Below is how the whole picture comes together: the engine injected the Opaque Predicates (Step 2), encrypted the strings (Step 3), and appended the helper function (Step 4).

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

// Step 4: Injected helper function
func xor(input string) string { ... }

```

Comparing the build artifacts shows three mathematically distinct binaries with identical behavior.

```bash
$ sha256sum agent_*
e84808...1af *agent_1.exe
79e3f2...759 *agent_2.exe
89edec...11e *agent_3.exe

```

## Closing Thoughts

This experiment proved that true polymorphism requires modifying the structure of the binary at the byte level. By treating source code as a data structure rather than text, we can generate functionally identical but structurally unique variants for every deployment.

If you want to bypass modern EDR systems, stop relying on Makefiles or static variables, and start writing compiler middleware tools.

> *The code demonstrated above is a simplified proof-of-concept. My internal engine expands on this logic to handle recursive directory processing, collision avoidance for multi-file packages, and per-file encryption key rotation. These features were omitted here to keep the code readable.*