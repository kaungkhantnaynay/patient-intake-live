# UI and UX Design Decisions

The interface is designed for two different users: a patient completing a form
and a staff member repeatedly scanning incoming information. Both views share
the same visual language, but each screen is organized around its main task.

## Shared Visual Direction

- A calm healthcare palette uses blue for primary actions, cyan for live
  updates, green for successful submission, and warm yellow for required-field
  labels.
- White surfaces, light borders, and restrained shadows separate content
  without making the pages feel crowded.
- Clear headings and muted supporting text create a strong reading order.
- Cards use a small border radius to keep the product practical and
  work-focused.
- Focus rings, form labels, error messages, and status text remain visible for
  keyboard and assistive-technology users.

## Home Screen

The home screen gives reviewers direct access to the two workflows. A real
background image establishes the healthcare context, while a light overlay
keeps the text readable. The patient and staff choices are shown together so a
reviewer can understand the product structure immediately.

On small screens, the choices stack vertically. On wider screens, they sit in
two columns to use the available space without stretching the content.

## Patient Form

The patient form is divided into four numbered sections: personal, contact,
background, and emergency details. This reduces the feeling of one long form
and helps patients understand their progress.

- Required and optional fields are labeled explicitly.
- Validation appears after a field is visited and again on submission.
- The progress panel shows required-field completion and the current patient
  status.
- The submit area stays visually separate from the form sections.
- After a successful submission, the fields clear so the page is ready for a
  new patient entry.

On mobile, every field uses the full width for comfortable reading and touch
input. At medium screen sizes, related fields move into two columns. The address
field remains full width because it needs more room.

## Staff Dashboard

The dashboard is designed for scanning rather than editing.

- Connection health, patient status, completion count, and last update time
  appear before the patient details.
- Empty values use muted text so completed values stand out.
- The most recently changed field receives a brief background highlight.
- Information is grouped into the same sections as the patient form, making it
  easy to compare both views.
- Status uses both text and color, so meaning does not depend on color alone.

On small screens, status panels and field groups stack in one column. On larger
screens, the summary and detail groups use two-column layouts so staff can
compare more information at once.

## Motion and Feedback

Motion is short and functional. Buttons slightly scale when pressed, progress
and field highlights transition quickly, and reduced-motion preferences are
respected. These details confirm interaction and explain changing state without
slowing down repeated use.

## Responsive Strategy

The layouts begin with a mobile-first single column and add columns only when
there is enough horizontal space.

| Screen size | Layout behavior |
| --- | --- |
| Small screens | Single-column form, stacked dashboard panels, full-width actions |
| Medium screens | Two-column form fields and side-by-side home choices |
| Large screens | Two-column staff summaries and patient detail groups |

Content widths are limited so lines remain readable on wide displays. Padding
increases slightly on larger screens while the main structure stays familiar
across devices.
