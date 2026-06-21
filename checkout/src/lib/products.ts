// Single source of truth for the ONE bundle we ship first.
// Per task brief: "Agent OS Install Guide" or "skill-hub buyer kit" — neither exists yet,
// so we create "Agent OS Install Guide" as a $9 PDF bundle (first paid SKU).

export type Product = {
  id: string;             // stable id used in URLs + DB
  slug: string;           // marketing slug
  name: string;
  tagline: string;
  description: string;
  priceCents: number;     // Stripe expects integer cents
  currency: 'usd';
  file: string;           // path under /public — relative to repo
  fileName: string;       // filename shown in download
  features: string[];
  lemonsqueezyVariantId?: string; // filled in once LS account exists
  stripePriceId?: string;         // filled in once Stripe Product created
};

export const PRODUCTS: Record<string, Product> = {
  'agent-os-install-guide': {
    id: 'agent-os-install-guide',
    slug: 'agent-os-install-guide',
    name: 'Agent OS Install Guide',
    tagline: 'Bootstrap your own agent box in under an hour.',
    description:
      'A 24-page PDF walkthrough: hardware picks, OS install, mesh networking, ' +
      'secrets vault, agent bootstrap, and the 10 commands you actually use day-to-day. ' +
      'Born from the MoxBox Proxmox + DoraPad + WinBox mesh.',
    priceCents: 900, // $9.00
    currency: 'usd',
    file: '/bundles/agent-os-install-guide.pdf',
    fileName: 'agent-os-install-guide-v1.0.pdf',
    features: [
      'Hardware shortlist (new + refurbished)',
      'Proxmox + ZFS bootstrap',
      'Mesh VPN (WireGuard) setup',
      'Secrets vault (.hermes/.env) pattern',
      'Agent bootstrap script (1 command)',
      'Daily-driver command cheat sheet',
    ],
  },
};

export function getProduct(id: string): Product | undefined {
  return PRODUCTS[id];
}

export function listProducts(): Product[] {
  return Object.values(PRODUCTS);
}