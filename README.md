# My Capstone Project

Frontend AI Engineering Capstone project for the FlyRank AI internship program.

## Tech Stack
- Node.js
- HTML / CSS / JavaScript

## Getting Started

`ash
git clone [https://github.com/your-username/my-capstone-repo.git](https://github.com/your-username/my-capstone-repo.git)
cd my-capstone-repo
``n
## License
MIT — see [LICENSE](LICENSE).
## FE-07 Tool Contract: `scoreLead`

- **Naziv alata:** `scoreLead`
- **Zod Shema:** `scoreLeadSchema` (`companyName`, `employeeCount`, `budget`, `industry`)
- **Stanja alata:** Podržana sva 4 stanja (`input-streaming`, `input-available`, `output-available`, `output-error`) sa tranzicijom od 200ms.
- **Prikaz:** Rezultat se prikazuje kao Lead Score UI Kartica sa statistikom i klasifikacijom.
## FE-08: Error States, Empty States, and Edge Cases

Implementirana je kompletna obrada grešaka i edge case-ova u skladu sa specifikacijom:

- **Global Error Boundary (`app/error.tsx`)**: Hvata neočekivane sistemske greške na ruti i omogućava reset/pokušaj ponovo.
- **First-run Empty State (Onboarding)**: Kada nema poruka, korisniku se prikazuju dizajnirani prijedlozi pitanja sa funkcijom "click-to-fill".
- **Skeleton Loading State**: Sprečava CLS (Cumulative Layout Shift) pomjeranje elemenata tokom učitavanja.
- **Sabotaža i Testiranje Grešaka**: Omogućen padajući meni za testiranje tri scenarija:
  1. *Happy Path* (normalno izvršavanje)
  2. *429 Rate Limit* (dizajnirano obavještenje o prekoračenju)
  3. *500 Mid-Stream Prekid* (dizajnirano obavještenje o prekidu streama)
- **Retry Akcija**: Dugme "Pokušaj ponovo" ponavlja slanje zadnje neuspjele poruke korisnika bez brisanja prethodne konverzacije.
- **Mobile Safari Optimizacija**: Korišten `100dvh` za spriječavanje prelivanja viewporta i `16px` font-size na unosnom polju za spriječavanje auto-zooma.