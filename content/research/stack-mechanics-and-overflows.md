---
title: "The Mechanical Inevitability of Buffer Overflows"
date: 2025-11-28
draft: false
description: "A deep dive into stack mechanics. Why does writing data 'up' cause a stack violation 'down'? Re-learning memory from first principles."
tags: ["Reverse Engineering", "Assembly", "Internals"]
---

## The "Black Box" Problem

For a long time, I viewed assembly instructions as black boxes. I knew that `CALL` invoked a function and `RET` completed it. I also knew that if I stuffed enough "A"s into a buffer, the program would crash.

However, I didn't understand the mechanics of this crash. I couldn't comprehend why the CPU-a machine engineered for precision-would so easily confuse user-supplied data with code addresses.

To clear up this confusion, I had to stop looking at the code for a moment and focus entirely on the **Stack Pointer (`RSP`)**.

---

## 1. The Environment: Stack vs. Heap

The first hurdle was visualizing memory correctly. We frequently use the phrase "Stack and Heap," but in terms of behavior, they are polar opposites.

* **The Heap (A warehouse of sorts):** You allocate memory here manually using the `malloc` function. It grows **UP**, from lower to higher memory addresses. It is chaotic, flexible, and meant for long-term storage.
* **The Stack (A workbench of sorts):** This is where the CPU handles immediate, transient tasks. It is automatic, strictly ordered, and-crucially-it grows **DOWN**, from higher to lower memory addresses.

This "downward growth" is the core principle. When a function requires space for variables, it doesn't add memory; instead, it **subtracts** from the Stack Pointer to allocate a new working area. When these two regions intersect, memory is considered exhausted.

{{< figure src="/.gitbook/assets/stack-heap-vis.png" alt="data" >}}

---

## 2. The Movement of RSP

The Stack Pointer (`RSP`) is not a mere cursor; it is a **boundary line**.

* Everything **above** `RSP` (at higher addresses) represents saved data that must be preserved, such as function return addresses.
* Everything **below** `RSP` (at lower addresses) is temporary workspace-unallocated memory that has not been used yet.

When executing instructions, we are simply shifting this boundary line.

### Allocation is Subtraction

In high-level languages, we declare variables. In assembly, we simply move the line.

* `SUB RSP, 0x20`: This creates a 32-byte buffer. We didn't actually create anything; we just shifted `RSP` down by 32 bytes and designated this space as ours.
* `ADD RSP, 0x20`: This frees the buffer. We slide `RSP` back up. The data technically remains there, but it enters a volatile zone, ready to be overwritten by the next function execution.

{{< figure src="/.gitbook/assets/stack-claim.png" alt="data" >}}

---

## 3. The Conflict: Writing vs. Allocation

To understand the flaw, look at this simple C program:

```c
int func() {
    char buffer[8]; // The vulnerability lives here
    return 0xbeef;
}

int main() {
    func();
    return 0xfeeb;
}

```

When `main` calls the `func` function, the following mechanical steps occur at the assembly level:

1. `call func` - Executing a call performs two actions. First, it runs the `PUSH RIP` instruction. It takes the address of the next instruction and pushes it onto the stack. This is the **Saved Return Address**. Then, it executes a `JMP func` to pivot the CPU to the function.
2. `sub rsp, 28h` - Inside the function, the Stack Pointer (`RSP`) moves **DOWN**. Subtracting in this context means shifting `RSP` to a lower memory address, clearing out space for our buffer and other operations.
3. **The Write Operation** - This is where user input occurs, typically handled by functions like `strcpy` or `gets`.
4. `RET` - When the function finishes, it executes the `RET` instruction. This command performs a `POP RIP` operation: it looks at the top of the stack, pops the value sitting there (which should be the **Saved Return Address**), and loads it into the Instruction Pointer (`RIP`).

### The Mechanical Flaw

This is the exact realization that made everything click. We have a fundamental conflict of directions here:

1. **The stack grows DOWN:** We allocate space by moving `RSP` toward **lower addresses**.
2. **Buffers write UP:** When writing data into an array, the write operation moves from the start (**lower address**) toward the end (**higher address**).

If we visualize memory during the write operation, this collision becomes obvious.

**Memory Layout on the Stack (High to Low Addresses):**

```text
[ 0x00007fffffffe018 ]  <-- Saved Return Address (Pushed by CALL)
[ 0x00007fffffffe010 ]  <-- Old Base Pointer (Saved RBP)
[ 0x00007fffffffe000 ]  <-- Start of 'buffer' (RSP is here)

```

If we write 8 bytes ("ABCDEFGH"), we fill the buffer perfectly up to `0x...008`.
But if we write data longer than 16 bytes:

```text
Input: "AAAAAAAAAAAAAAAA" + "BBBBBBBB" + "DEADBEEF"

```

The write operation begins at the bottom and climbs **UP**:

1. **"AAAAAAAAAAAAAAAA"** fills the buffer and padding.
2. **"BBBBBBBB"** overwrites the saved base pointer (Old RBP).
3. **"DEADBEEF"** overwrites the **Saved Return Address**.

When `RET` executes, it has no awareness that the stack was corrupted. It blindly pops the `0xDEADBEEF` value into the `RIP` register, and program execution jumps straight to our malicious address: `0xDEADBEEF`.

## 4. The Blind Trust of `RET`

When the function concludes its execution, it runs the `RET` instruction. This is the precise window where our exploit triggers.

`RET` is a mechanical instruction. It does exactly one thing:

1. Looks at the location pointed to by `RSP`.
2. Grabs the value sitting there.
3. Loads that value into the Instruction Pointer (`RIP`).

**The logic flaw is simple:** `RET` does not validate what it is popping. It assumes that because the value resides on the stack, it must be valid.

If we successfully overwrite that slot with `0xDEADBEEF`, the processor does not perceive it as junk data. It recognizes it as the next execution address.

It blindly jumps to `0xDEADBEEF`.

## Conclusion

Buffer overflows are not magic or esoteric science. They are the result of a mechanical collision between two opposing vectors: the stack allocating downward, and data writing upward.

To hijack execution control, we do not need to break the software's application logic. We only need to replace the top of the stack with our target address and wait for the processor to blindly execute the instruction.