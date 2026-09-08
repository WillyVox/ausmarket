// Pure formatting helpers — no Prisma/DB dependency, safe to import
// from client components. Used by repository.ts (to format rows
// before returning them to pages) and directly by components that
// already receive a pre-fetched date/amount as a prop.
 
export function verifiedLabel(date: string | Date | null): string {
    if (!date) return "Not verified";
    if (typeof date === "string") return date;
    return date.toISOString().slice(0, 10);
  }
   
  export function formatMinimumDeposit(amount: number | null): string {
    if (amount === null || amount === undefined) return "Not verified";
    return `$${amount.toLocaleString()}`;
  }
   