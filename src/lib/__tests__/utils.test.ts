import { describe, expect, it } from "vitest"

import { cn } from "@/lib/utils"

describe("cn", () => {
  it("concatena classes verdadeiras", () => {
    expect(cn("a", "b")).toBe("a b")
  })

  it("ignora valores falsy", () => {
    expect(cn("a", undefined, false, null, "b")).toBe("a b")
  })

  it("resolve conflitos do Tailwind preferindo a ultima", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
  })
})
