/**
 * AZHR HRMS — Employee Form Validation Rules
 */

import { DEPARTMENTS, DESIGNATIONS } from '../../../constants/departments.js';

/**
 * Validates Employee form data
 * @param {Object} data Employee fields
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateEmployee(data) {
  const errors = {};

  // Employee Code
  if (!data.employee_code || !data.employee_code.trim()) {
    errors.employee_code = 'Employee Code is required (e.g. EMP-106).';
  } else if (!/^[A-Z0-9_-]{3,15}$/i.test(data.employee_code.trim())) {
    errors.employee_code = 'Employee Code must be 3-15 alphanumeric characters.';
  }

  // First Name
  if (!data.first_name || !data.first_name.trim()) {
    errors.first_name = 'First name is required.';
  } else if (data.first_name.trim().length < 2) {
    errors.first_name = 'First name must be at least 2 characters.';
  }

  // Last Name
  if (!data.last_name || !data.last_name.trim()) {
    errors.last_name = 'Last name is required.';
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !data.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  // Phone
  if (!data.phone || !data.phone.trim()) {
    errors.phone = 'Contact phone number is required.';
  } else if (!/^[0-9+()-\s]{7,20}$/.test(data.phone.trim())) {
    errors.phone = 'Please provide a valid phone number.';
  }

  // Department
  if (!data.department || !data.department.trim()) {
    errors.department = 'Department selection is required.';
  } else if (!DEPARTMENTS.includes(data.department.trim())) {
    errors.department = 'Selected department is invalid.';
  }

  // Designation
  if (!data.designation || !data.designation.trim()) {
    errors.designation = 'Designation is required.';
  } else if (!DESIGNATIONS.includes(data.designation.trim())) {
    errors.designation = 'Selected designation is invalid.';
  }

  // Joining Date
  if (!data.joining_date) {
    errors.joining_date = 'Joining date is required.';
  } else {
    const parsedDate = new Date(data.joining_date);
    if (isNaN(parsedDate.getTime())) {
      errors.joining_date = 'Invalid date format.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
