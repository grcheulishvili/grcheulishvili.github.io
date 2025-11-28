---
title: "Engineering Log: The Mechanical Inevitability of Buffer Overflows"
date: 2025-11-28
draft: false
description: "A deep dive into stack mechanics. Why does writing data 'up' cause the stack to break 'down'? Re-learning memory from first principles."
tags: ["Reverse Engineering", "Assembly", "Internals"]
---

## The "Black Box" Problem
For a long time, I treated assembly instructions like black boxes. I knew that `CALL` started a function and `RET` ended it. I knew that if I threw enough "A"s at a buffer, the program would crash.

But I didn't understand the *mechanics* of the crash. I didn't understand why the CPU—a machine built for precision—would so easily confuse my user input for a code address.

To fix this, I had to stop looking at the code and start looking at the **Stack Pointer (`RSP`)**.

---

## 1. The Stage: Stack vs. Heap
The first hurdle was visualizing memory correctly. We often say "Stack and Heap," but they are essentially opposites in behavior.

* **The Heap (The Warehouse):** This is where you manually ask for space (`malloc`). It grows **UP** (from low memory addresses to high ones). It's messy, flexible, and persistent.
* **The Stack (The Workbench):** This is where the CPU does its immediate work. It is automatic, strictly ordered, and—crucially—it grows **DOWN** (from high memory addresses to low ones).



This "downward growth" is the key. When a function needs space for variables, it doesn't "add" memory. It **subtracts** from the Stack Pointer to carve out a scratchpad. When the two overlap, that's when the memory is said to be "exhausted".

{{< figure src="/.gitbook/assets/stack-heap-vis.png" alt="data" >}}

---

## 2. The Choreography of RSP
The Stack Pointer (`RSP`) isn't just a cursor; it is the **boundary line**.
* Everything **above** `RSP` (Higher Addresses) is "Saved Data" (things we want to keep, like return addresses).
* Everything **below** `RSP` (Lower Addresses) is "Volatile Space" (garbage memory waiting to be used).

When we execute instructions, we are just moving this boundary line.


### Allocation is Subtraction
In high-level languages, we declare variables. In Assembly, we just move the line.
* `SUB RSP, 0x20`: This creates a 32-byte buffer. We didn't "create" anything; we just slid the `RSP` down 32 bytes and said, "This space is now mine."
* `ADD RSP, 0x20`: This "frees" the buffer. We slide the `RSP` back up. The data is technically still there, but it is now in the "Volatile" zone, ready to be overwritten by the next function.

{{< figure src="/.gitbook/assets/stack-heap-vis.png" alt="data" >}}

---

## 3. The Conflict: Writing vs. Allocating
This is the specific realization that made everything click for me.

There is a fundamental conflict in direction:
1.  **The Stack grows DOWN:** We allocate space by moving `RSP` to lower addresses.
2.  **Buffers write UP:** When we write data into an array (like "Hello"), we write from the start (Low Address) to the end (High Address).

### The Crash Scenario
Imagine we are inside a function. The stack looks like this:

`[ High Address: 0xFFFF ]`  <- **Saved Return Address** (The target)
`[ Mid Address ]`           <- Saved Base Pointer (RBP)
`[ Low Address: 0x1000 ]`   <- **Our Local Buffer** (RSP is here)

When the function asks for input (e.g., `gets(buffer)`), the CPU starts writing at `0x1000`.
* It writes "A" at `0x1000`.
* It writes "B" at `0x1001`.
* It writes "C" at `0x1002`.

It climbs **UP** the ladder.

If we stop writing at the end of the buffer, everything is fine. But if we keep writing? We climb right out of our local buffer, climb over the saved `RBP`, and smash directly into the **Saved Return Address**.

We didn't just corrupt memory; we replaced the "GPS coordinates" the CPU needs to find its way home.

---

## 4. The Blind Trust of `RET`
When the function finishes, it executes `RET`. This is the moment the exploit triggers.

`RET` is a mechanical instruction. It does exactly one thing:
1.  It looks at where `RSP` is pointing.
2.  It takes the value sitting there.
3.  It jams that value into the Instruction Pointer (`RIP`).

**The logic flaw is simple:** `RET` does not check *what* it is popping. It assumes that because the value was on the stack, it must be valid.

If we managed to overwrite that slot with `0xDEADBEEF`, the CPU doesn't see "garbage data." It sees "The address I must go to next."

It blindly jumps to `0xDEADBEEF`.

## Conclusion
Buffer overflows aren't magic. They are the result of a mechanical collision between two opposing forces: the stack allocating downwards, and data writing upwards.

To hijack execution, we don't need to "hack" the software logic. We just need to replace the top of the stack with our own address, and wait for the CPU to blindly follow instructions.