# -LoveHack-Season-2
Submission For LovHack Season 2
DESIGN OBJECTIVES
Design and prototype an incident reporting system (web based,
responsive design) for nursing home settings. Provide user
specific interface for Report Submission & Analysis.
Report Submission, Processing, and Analysis: System for accessing
and completing/ submitting incident records. System access for credentialed
users (login & profile feature) with the primary purpose of analyzing incident
reports. System should provide dashboard analytics for reported data, as well
identify trends and prompt user for action.
BACKGROUND
PROCESS
• To report an incident- an employee (or administrator)
completes an injury or illness report
• Submitting an incident report creates a case. The admin adds
other form types (e.g. workers comp, OSHA 300/301) to a
case.
• If the injury requires medical attention or if the employee
requests time off, then a worker compensation form must be
completed by the ADON/ Business Manager.
• OSHA 300/301 form is later submitted by an admin
REPORTS
• Incident report incudes the following data elements: employee name,
manager name, shift, employee position, event date and time, injury
type, injury description, medical symptoms, medical evaluation (Y/N),
medical diagnosis (dependent on evaluation). System should create
timestamp for report submission.
• Worker compensation form has the following data fields: employee
name, home address, home phone, birth date, social security number,
gender, hire date, marital status, location, job type, incident location,
work phone, manager’s name, manager’s phone, date and time of
incident, date and time for reporting the incident, witnesses, activities
performed prior to incident, incident type, incident description, parts of
the body affected, type of injury, injury location, “have you ever been
treated for a similar injury?”, “are you requesting medical treatment at
this time?”.
• OSHA 300/301
ASSIGNMENT REQUIREMENTS
• Used mostly on desktop (System)/ mobile (Portal)
• System access via login
• Access to multiple form types (e.g., Injury, Illness)
• View blank forms & review submitted forms (by all users)
• Complete and submit forms (for self and other staff)
• Save form to complete and submit later (for self and other
staff)
• Show confirmation with report # for submitted forms; Show
case status; Show submitted by and date tracked by system
• Repository of incomplete and submitted forms
• Append an incident case with administrator review
and additional (associated) forms
SYSTEM
• Create case and case # on incident report submission
• Timestamp all report submissions and edits (after submission)
• Assign report reviewer
• Track report changes by user, date, and time
• Populate OSHA 301 report (individual case)
• Populate OSHA 300 report (across records) by time period
• Track review/ case status
• Track case classification
• Log completed by and date/time information
Display table of case data
– Case #
– Employee Name
– Manager Name
– incident date and time
– Injury Type
– incident Report Review Status: Reviewed, Pending
– Workers Compensation Status: None, Pending, Completed
– OSHA 300 Status: Not recordable, Pending, Completed
– OSHA 301 Status: Not recordable, Pending, Completed
– Employee Status: At work, On Leave
– Date of Expected Return (If status= On Leave)
– Case Status: Open, Closed
Incident Report:
• employee name
• manager name
• Shift
• employee position
• event date and time
• Incident location
• injury type
• injury description
• medical symptoms
• medical evaluation (Y/N)
• medical diagnosis (dependent on evaluation)
System: date/timestamp for report submission
OSHA 301
Completed by (system generated)
• Name
• Title
• Phone
• Date
Employee Info:
• Full Name
• Home address
• Date of birth
• Date hired
• Gender
Incident Information:
• Physician or other health care
professional contact information
• If treatment was given away from the
worksite, where was it given?
Incident Information:
• Treatment Facility address (dependent on previous question)
• Was employee treated in an emergency room?
• Was employee hospitalized overnight as an in-patient?
• Case number from the Log
• Date of injury or illness
• Time employee began work (related to shift information)
• Time of event
• What was the employee doing just before the incident occurred?
Describe the activity, as well as the tools, equipment or material
the employee was using. Be specific. Examples: "climbing a
ladder while carrying roofing materials"; "spraying chlorine from
hand sprayer"; "daily computer key-entry."
• *What happened? Tell us how the injury occurred. Examples:
"When ladder slipped on wet floor, worker fell 20 feet"; "Worker
was sprayed with chlorine when gasket broke during
replacement"; "Worker developed soreness in wrist over time."
• *What was the injury or illness? Tell us the part of the body that
was affected and how it was affected. Examples: "strained
back"; "chemical burn, hand"; "carpal tunnel syndrome."
• *What object or substance directly harmed the employee?
Examples: "concrete floor"; "chlorine"; "radial arm saw." If this
question does not apply to the incident, leave it blank.
• If the employee died, when did death occur? Date of death
OSHA 301
• *What happened? Tell us how the injury occurred. Examples: "When ladder slipped on
wet floor, worker fell 20 feet"; "Worker was sprayed with chlorine when gasket broke
during replacement"; "Worker developed soreness in wrist over time."
• *What was the injury or illness? Tell us the part of the body that was affected and how
it was affected. Examples: "strained back"; "chemical burn, hand"; "carpal tunnel
syndrome."
• *What object or substance directly harmed the employee? Examples: "concrete floor";
"chlorine"; "radial arm saw." If this question does not apply to the incident, leave it
blank.
• If the employee died, when did death occur? Date of death
Worker Comp.
employee name
(From HR dB- only populates with
Workers Comp report)
gender
birth date
social security number
marital status
home address
personal phone
hire date
job type
work phone
manager’s name
manager’s phone
HCD: Prof. Millet
date and time for reporting the
Incident
(Need verification/ supplementation )
date and time of incident
incident location
incident type
incident description
incident witnesses
Injury type
Injury description
activities performed prior to incident
parts of the body affected
Ever treated for a similar injury?
Requesting medical treatment at this time?
Physician Contact Information
Time off requested (date range)


Problem Statement 
Nursing home frontline workers experience some of the highest rates of occupational injury in the U.S., yet 50–96% of medical errors and near misses go unreported. Current reporting systems are largely paper-based, cumbersome, and designed for administrative staff rather than frontline staff's needs and time constraints, resulting in lost safety data, limited feedback, and a reactive approach to workplace safety rather than proactive prevention.

Secondary Research
Underreporting of medical errors and near misses is a systematic issue in healthcare. Research showed that 50% - 96% of medical errors go unreported by nurses. In nursing homes, staff typically report only severe adverse events, leaving minor incidents unrecorded. A PMC study (1) found nurses often avoid incident reporting due to negative prior experiences and fear of personal consequences, such as anxiety, depression, and social exclusion.
A paper published in the Western Journal of Nursing Research (Hamed & Konstantinidis, 2022) identified the most prevalent barriers to incident reporting among nurses. These include:
•	Fear of blame, disciplinary action, and repercussion: the most universally cited barrier
•	Heavy workload: reporting is perceived as too time-consuming relative to direct care demands.
•	Lack of feedback: When reports disappear without response or follow-up, staff view reporting as pointless.
•	Unclear routines and poor system usability undermine staff confidence in using reporting tools.
•	Organizational/blame culture - environments that punish rather than learn from errors
A ScienceDirect study (2) identified further nursing home barriers: unclear outcomes, lack of managerial support, staff-supervisor conflicts, and insufficient training on reporting technology.

Research from RTI International and the Bureau of Labor Statistics (3) confirms the severity of the problem:
•	60.2% of Certified Nursing Assistants (CNAs), staff who provide direct care to patients, nationally reported a work-related injury in the prior year; 65.8% of those reported being injured more than once.
•	Nursing aides, who assist patients with daily activities, had the highest musculoskeletal disorder rates of any occupation — 249 cases per 10,000 workers. Musculoskeletal disorders refer to injuries to muscles, nerves, tendons, joints, cartilage, or spinal discs.
•	9,230 back-related incidents among nursing assistants were recorded by the BLS in a single year
•	Approximately 800,000 needlestick injuries occur annually in U.S. healthcare settings; up to 42.8% of nurses have experienced a sharps injury in their career.
•	CNAs working mandatory overtime, newer to the job, or without adequate staffing, were most likely to be injured and least likely to have reliable access to a reporting system.

While OSHA does not mandate recording of near misses, it strongly encourages it as a proactive safety measure (4). Research by Frank Bird (based on 1.7 million incident reports from over 300 companies) found that for every serious injury, there are 600 near misses. In healthcare, near-miss events represent errors caught before patient or worker harm occurs, making them critical data points for intervention.

A 2024 study published in PMC (5) found that access to and regular use of an electronic reporting system were significant predictors of increased voluntary near-miss reporting among nurses. Organizations that paired electronic systems with non-punitive safety cultures saw substantially higher near-miss reporting rates.

Most near-miss reporting in nursing homes is paper-based, with only limited digital adoption for official accident reporting. Forms are hard to find, require supervisor mediation, capture mainly narrative data, and lack follow-up. Even web-based systems suffer from usability issues, limited mobile access, and forms that do not reflect real workflows.

A paper (Scott, 2025) published in the Journal of Advanced Nursing found that most care home safety incident reporting systems lack standardization, structured data collection, and feedback loops, which limits their value for quality improvement. (6)

HCD methodology applied to healthcare IT has been shown to improve usability, adoption, and safety outcomes. A landmark paper published in JMIR Human Factors (2017) (7) established a three-phase HCD methodology for connected health systems: 1 contextual inquiry to specify user and context, 2 requirement specification with real users, and 3 iterative design and evaluation. Studies applying this approach to clinical software consistently find that, without HCD, even well-intentioned digital tools fail to be adopted in high-acuity, high-turnover environments such as nursing homes (8).

Together, these findings suggest that underreporting is not simply a behavioral issue, but a systemic failure shaped by organizational culture and poorly designed reporting tools.

Design Precedents
Several existing healthcare incident reporting systems were reviewed to inform my design and identify any gaps in current solutions

QUASR is a cloud-based platform for incident reporting in healthcare and aged care, including nursing homes.

Relevant Features:
•	Stepper-based forms with skip logic to reduce cognitive load
•	Real-time dashboards with trend analysis
•	Root cause analysis tools (e.g., 5 Whys, Fishbone diagrams)
•	Configurable incident categories and severity levels
•	Notification systems and stakeholder discussion threads

RLDatix is a leading healthcare safety and risk management platform that enables incident reporting, compliance tracking, and analytics.

Relevant Features:
•	Role-based interfaces tailored to different user types
•	Automated mapping to regulatory requirements like OSHA reporting
•	Centralized case tracking with timestamps and audit logs
•	Mobile-accessible reporting





SafetyZone targets long-term care and nursing home incident reporting needs.

Relevant Features:
•	Pre-built templates for injury, illness, and near-miss reporting
•	Mobile and tablet accessibility
•	Modular form structure for different report types
•	Return-to-work tracking

While these systems provide strong capabilities in compliance, analytics, and risk management, they consistently prioritize administrative workflows over frontline usability. Drawing from these precedents, my design will incorporate the following:

•	Mobile-first streamlined reporting
Inspired by SafetyZone and QUASR, the system will support fast, low-effort reporting on multiple platforms.
•	Guided form design
Using stepper and skip-logic patterns from QUASR to reduce cognitive load and reporting time.
•	Role-based system structure
Following RLDatix, the system will provide separate experiences for frontline staff and administrators.
•	Clear case tracking and visibility
Borrowing from RLDatix’s audit trail, reporters will be able to track the status of their submissions.
•	Integrated compliance support
Incident data will automatically populate OSHA and workers’ compensation reporting requirements.

<img width="468" height="642" alt="image" src="https://github.com/user-attachments/assets/de19c827-ac3b-4293-a6cc-d41ee3ea3947" />
