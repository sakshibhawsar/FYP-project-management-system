export const generateApprovalEmailTemplate = (name, role) => {
  return `
    <h2>Welcome ${name} 🎉</h2>
    <p>Your account has been approved.</p>
    <p><strong>Role:</strong> ${role}</p>
    <p>You can now login to the system.</p>
  `;
};