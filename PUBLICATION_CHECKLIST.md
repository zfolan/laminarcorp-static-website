# Laminar publication checklist

Confirm each item with the product or company owner before publishing.

- [ ] Household-level analysis scope and supported account types
- [ ] Supported holdings, model, allocation, cash, restriction, and currency fields
- [ ] Current drift, concentration, and risk-analysis capabilities
- [ ] Current recommendation-generation and trade-sizing behavior
- [ ] Supported account-selection and trade-distribution behavior
- [ ] Tax data currently available in the product
- [ ] Capital-gain estimates and gains/losses presentation
- [ ] Asset-location support and degree of automation
- [ ] Exception categories and severity language
- [ ] Portfolio-manager modification, approval, and audit behavior
- [ ] Client-proposal and order-preparation outputs
- [ ] Whether direct trade execution is available (the site currently does not claim it)
- [ ] Integrations and data sources
- [ ] Security, privacy, compliance, and data-residency statements
- [ ] Legal review of tax-aware wording and non-advice disclaimer
- [ ] Demo form endpoint, routing, retention, consent, and privacy notice
- [ ] Company history, founders, team, location, milestones, careers, and photography
- [ ] Production domain, canonical URL, social image, analytics, and cookie requirements

The demo form intentionally shows success only after a configured endpoint responds successfully. Set `VITE_DEMO_REQUEST_ENDPOINT` before release and test both success and failure responses.
