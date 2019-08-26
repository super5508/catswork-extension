
function formatDate(date) {
	return `${(date.getMonth() + 1) < 10 ? '0' : ''}${date.getMonth() + 1}/${date.getDate() < 10 ? '0' : ''}${date.getDate()}/${date.getFullYear() % 100}`
}

function formatTime(date) {
	return `${date.getHours() !== 12 && (date.getHours() % 12) < 10 ? '0' : ''}${(date.getHours() % 12) || 12}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()} ${date.getHours() < 12 ? 'AM' : 'PM'}`
}

export function convertDateToMinutes(date) {
  return Math.floor(Date.parse(date) / 1000 / 60);
}

export default { formatDate, formatTime }
