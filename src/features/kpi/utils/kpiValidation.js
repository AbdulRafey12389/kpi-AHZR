/**
 * AZHR HRMS — KPI Entry Validation Rules
 */

/**
 * Validates a KPI entry form payload
 * @param {Object} data Form values
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateKpiEntry(data) {
  const errors = {};

  // Required Employee & Month
  if (!data.employee_id && !data.empId) {
    errors.employee_id = 'Employee is required.';
  }

  if (!data.month) {
    errors.month = 'Month is required.';
  } else if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(data.month)) {
    errors.month = 'Month must be in YYYY-MM format.';
  }

  // Attendance Validation
  const workingDays = Number(data.working_days ?? data.workdays ?? 26);
  const presentDays = Number(data.present_days ?? data.present ?? 0);
  const lateArrivals = Number(data.late_arrivals ?? data.late ?? 0);

  if (isNaN(workingDays) || workingDays <= 0) {
    errors.working_days = 'Working days must be greater than zero.';
  }

  if (isNaN(presentDays) || presentDays < 0) {
    errors.present_days = 'Present days cannot be negative.';
  } else if (presentDays > workingDays) {
    errors.present_days = `Present days (${presentDays}) cannot exceed working days (${workingDays}).`;
  }

  if (isNaN(lateArrivals) || lateArrivals < 0) {
    errors.late_arrivals = 'Late arrivals cannot be negative.';
  }

  // Task Validation
  const tasksAssigned = Number(data.tasks_assigned ?? data.assigned ?? 0);
  const tasksCompleted = Number(data.tasks_completed ?? data.completed ?? 0);
  const onTimeDelivery = Number(data.on_time_delivery ?? data.ontime ?? 0);

  if (isNaN(tasksAssigned) || tasksAssigned < 0) {
    errors.tasks_assigned = 'Tasks assigned cannot be negative.';
  }

  if (isNaN(tasksCompleted) || tasksCompleted < 0) {
    errors.tasks_completed = 'Tasks completed cannot be negative.';
  } else if (tasksCompleted > tasksAssigned && tasksAssigned > 0) {
    errors.tasks_completed = `Tasks completed (${tasksCompleted}) cannot exceed tasks assigned (${tasksAssigned}).`;
  }

  if (isNaN(onTimeDelivery) || onTimeDelivery < 0 || onTimeDelivery > 100) {
    errors.on_time_delivery = 'On-time delivery must be between 0% and 100%.';
  }

  // Behavior Validation (1-10 scale)
  const teamwork = Number(data.teamwork ?? data.behTeam ?? 0);
  const discipline = Number(data.discipline ?? data.behDisc ?? 0);
  const communication = Number(data.communication ?? data.behComm ?? 0);

  if (isNaN(teamwork) || teamwork < 0 || teamwork > 10) {
    errors.teamwork = 'Teamwork score must be between 0 and 10.';
  }

  if (isNaN(discipline) || discipline < 0 || discipline > 10) {
    errors.discipline = 'Discipline score must be between 0 and 10.';
  }

  if (isNaN(communication) || communication < 0 || communication > 10) {
    errors.communication = 'Communication score must be between 0 and 10.';
  }

  // Kaizen Validation
  const suggestionsSubmitted = Number(data.suggestions_submitted ?? data.kaiSubmit ?? 0);
  const suggestionsApproved = Number(data.suggestions_approved ?? data.kaiApproved ?? 0);

  if (isNaN(suggestionsSubmitted) || suggestionsSubmitted < 0) {
    errors.suggestions_submitted = 'Suggestions submitted cannot be negative.';
  }

  if (isNaN(suggestionsApproved) || suggestionsApproved < 0) {
    errors.suggestions_approved = 'Suggestions approved cannot be negative.';
  } else if (suggestionsApproved > suggestionsSubmitted && suggestionsSubmitted > 0) {
    errors.suggestions_approved = 'Approved suggestions cannot exceed submitted suggestions.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
