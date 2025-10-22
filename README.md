# Secure Firmware Update System for Embedded Devices

This project is a demo-grade management console for orchestrating secure over-the-air (OTA) firmware updates across embedded device fleets. It is built with Next.js 15, React 19, and Tailwind CSS 4 using the App Router and a collection of accessible Radix UI primitives.

## Features

- **Executive dashboard** – Real-time KPI cards summarizing fleet integrity, active devices, risk reduction, and pending deployments. Interactive cards display recent OTA pushes, STRIDE threat status, crypto posture, and SBOM compliance.  
- **Firmware lifecycle workspace** – A firmware catalog with upload, validation, deployment, and rollback workflows. Includes mock device counts, signature verification results, anti-rollback checks, and modal-driven deploy/upload actions.  
- **Threat modeling portal** – STRIDE-based analysis with filtering, category statistics, mitigation tracking, and detailed dialogs for each risk scenario.  
- **Validation utilities** – Dedicated routes under `/validation` for compliance automation, cryptographic verification, and audit readiness workflows.  
- **SBOM insights** – `/sbom` route visualizes CycloneDX inventory health, license posture, and vulnerability summaries.  
- **Responsive layout** – Shared sidebar navigation, sticky header, and dark-mode ready theming powered by `next-themes` and custom shadcn-inspired components.

## Project structure

```
app/
  page.tsx                 # Main dashboard experience
  firmware/                # Firmware catalog + deployment flows
  threats/                 # STRIDE threat modeling workspace
  sbom/                    # Software bill of materials insights
  validation/              # Compliance & attestation tooling
components/                # Reusable UI primitives and feature modules
hooks/                     # Custom React hooks (e.g., theme + UI state)
lib/                       # Configuration, mock data, and utilities
public/                    # Static assets
styles/                    # Tailwind layers and design tokens
```

> Note: Data is mock/sample only and is rendered client-side to showcase UX flows.

## Getting started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

   > `pnpm` is recommended because the repo ships with a `pnpm-lock.yaml`. You can also use `npm install`, but lockfile parity is not guaranteed.

2. **Run the development server**

   ```bash
   pnpm dev
   ```

   The app will be available at http://localhost:3000 with hot reload enabled.

3. **Lint the project**

   ```bash
   pnpm lint
   ```

4. **Build for production**

   ```bash
   pnpm build
   pnpm start
   ```

   `pnpm start` serves the generated production build.

## Technology stack

- **Framework**: [Next.js 15](https://nextjs.org/) App Router
- **Language**: TypeScript & React 19
- **Styling**: Tailwind CSS 4, CSS variables, Radix UI design tokens
- **UI components**: shadcn/ui-inspired primitives, Lucide icons, `sonner` toasts
- **Forms & validation**: React Hook Form + Zod resolvers
- **Charts & visuals**: Recharts, Embla Carousel, and Radix data displays
- **Theming**: `next-themes` with dark/light support

## Available scripts

| Command        | Description                                  |
| -------------- | -------------------------------------------- |
| `pnpm dev`     | Start the Next.js development server         |
| `pnpm build`   | Compile the production bundle                |
| `pnpm start`   | Run the compiled production server           |
| `pnpm lint`    | Lint source files with ESLint configuration  |

## Contributing

1. Fork and clone the repository.
2. Create a feature branch: `git checkout -b feature/awesome-improvement`.
3. Install dependencies and run the dev server to verify your changes.
4. Commit with descriptive messages and open a pull request.

## License

This project is provided for demonstration and educational use. Review project ownership requirements before deploying in production.
