/**
 * Shows a toast notification
 * @param {string} message - The message to display
 * @param {string} type - 'success' or 'error'
 * @param {number} [duration=3000] - Duration in milliseconds (default: 3000)
 */
function showToast(message, type = 'success', duration = 3000) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: duration,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    Toast.fire({
        icon: type,
        title: message,
        background: type === 'success' ? '#f0fdf4' : '#fef2f2', // Tailwind green-50/red-50
        color: type === 'success' ? '#166534' : '#991b1b',      // Tailwind green-800/red-800
        iconColor: type === 'success' ? '#22c55e' : '#ef4444'   // Tailwind green-500/red-500
    });
}