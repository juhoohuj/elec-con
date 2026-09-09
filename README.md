Electricity consumption and price data from the Finnish energy market. Project created as interview exercise.

Shows fetched data on a daily basis and displays basic columns for consumption, production and price.

I chose this stack because its familiar for me from previous projects
Stack used:
- React TS
- Express TS
- PostgreSQL DB
Other libraries:
- MUI for UI and graphs
- Basic linters, eslinter and builtin oxlinter which came with Vite


Features:
- Daily rows with consumption, production, avg price and negative price streak.
- Single day dialog with more detailed information.


Design decisions:
- For some days there are only 23 hours, apparently because of the time zone change. This was handled by the backend by adding a flag to the day stats.
- Some days didnt have data for every hour and was basically missing. These days are displayed as missing if we cannot accurately determine if the day is complete or not.


Something I left out:
- I wanted to create funny line showing where the negative streak continues to the next day aswell, but since the exercise didnt ask this, I left it out.


Usage of AI:
- Generating code, checked before commiting.
- Running tests, AI also generated some.
- Created the basic theme layout with my instructions.
- Used to help with designing and checking the data integrity



