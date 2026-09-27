# Ministry model and audience routing

Reviewed September 26, 2026 using the deployed i2 pages and the separate EMFCI registration site. This describes the ministry's published model; it does not independently verify impact counts or fundraising balances.

## The model

i2's core approach is multiplication through established church leadership. Senior denominational or network leaders adopt a coordinated initiative; national, regional and local launches equip trainers; those trainers mobilize churches in prayer, evangelism and discipleship. Ongoing coaching, local coordination and progress reporting support the work after the launch.

- **EMFCI:** the Every Muslim for Christ Initiative is the overarching partnership and activation framework.
- **MMWU:** Mission Muslim World University develops leaders and trainers through advanced study. The published degree pathway combines MMWU and God's Bible School & College coursework. It is not accurate to describe all free training as an accredited degree.
- **WADI:** free on-demand video training provides a low-barrier learning route.
- **WISE Global:** supports ministry coordination and progress across individuals, teams, churches and denominations. It is a supporting tool within the initiative, not an alternative university.
- **Donors:** support national launches, translated curriculum, scholarships, technology, logistics and continued coaching. Do not imply that a quiz selection designates a donation or guarantees a particular ministry outcome.

The separate EMFCI intake asks leaders to agree to mobilize 100–10,000 national leaders into the MMWU scholarship program, authorize trainer-led launch conferences, mobilize local-church outreach, and adopt WISE for tracking. It asks about organization, ministry title, leader capacity and training language. The short homepage quiz should not duplicate that application or imply agreement to it.

## Sources

- [EMFCI model, case reports and funding](https://www.i2ministries.org/the-initiative)
- [Official EMFCI registration and ministry agreement](https://www.i2ministries-emfci.com/)
- [Training pathways](https://www.i2ministries.org/get-trained)
- [MMWU curriculum and degree pathway](https://www.i2ministries.org/mmwu)
- [WISE ministry coordination](https://www.i2ministries.org/wise-global)
- [Giving and stewardship](https://www.i2ministries.org/donate)

Some existing pages describe WISE capabilities as both available and awaiting development, and MMWU/course/country totals vary by context. The quiz avoids repeating these unsettled details. A broader content review should reconcile them with ministry owners before changing claims.

## Quiz structure

Question 1: **How would you like to take part?** Four choices, with network leaders and donors first. Question 2 asks the visitor's immediate intent. The result explains the recommendation, with one primary destination and one quieter alternative. No scoring, qualification gate, email capture, subscription, financial commitment or application submission.

| Audience | Intent | Primary destination |
|---|---|---|
| Denomination/network leader | Explore a launch | Contact, EMFCI subject selected |
| Denomination/network leader | Understand the model | Initiative overview |
| Denomination/network leader | Ready to register | Official EMFCI agreement/intake |
| Denomination/network leader | Coordinate existing outreach | WISE overview |
| Donor | Explore impact | Giving opportunities |
| Donor | Strategic/major gift | Contact, giving subject selected |
| Donor | Train a leader | MMWU scholarship information |
| Donor | Ready to give | Existing giving-method page |
| Church/ministry team | Get training | Training overview |
| Church/ministry team | Mobilize churches | Initiative overview |
| Church/ministry team | Coordinate outreach | WISE overview |
| Individual learner | Free training | WADI |
| Individual learner | Advanced study | MMWU |
| Individual learner | Help choosing | Training overview |

Exploratory leaders default to Contact, while a separate explicit registration choice leads to the existing agreement. Ryan was asked whether exploratory leaders should instead start with the overview or a scheduling link; no new scheduling URL was invented.

## Popup behavior

- Homepage only. It replaces that page's timed ebook popup; existing ebook links remain.
- Automatically appears six seconds after an existing or newly completed privacy choice, including Reject optional, if the visitor is still near the top and not using a control or another dialog.
- A visible **Find your next step** button opens it immediately and reopens it after dismissal.
- Escape, Close, Skip, Back, keyboard focus containment and focus restoration are supported.
- Closing/completing stores a session dismissal flag. Answers stay in memory and are neither stored nor sent as quiz responses. Choosing a contact destination includes only a known topic in the URL; the user still writes and submits their own message.
- Consent remains separate. The quiz neither permits videos nor loads third-party resources. It also suppresses the ebook invitation on destination pages for the visit.

## Suggested broader website structure

Homepage: mission and audience routes → Partner / Equip / Activate model → one documented field result → donor funding opportunity → network and donor next steps. Training resources sit within that story. The mission page should lead from urgency to the plan immediately, with detailed statistics available farther down or in expandable sections.
