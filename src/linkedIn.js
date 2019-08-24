import 'less/linkedIn.less'

const overlayElement = document.createElement('div')
overlayElement.id = 'catswork_inject_overlay'
const overlayTextElement = document.createElement('div')
overlayElement.appendChild(overlayTextElement)

overlayElement.addEventListener('click', function () {
	clearTimeout(overlayElementTimeout)

	overlayTextElement.classList.remove('catswork_inject_overlay_active')
	setTimeout(() => {
		overlayElement.classList.remove('catswork_inject_overlay_active')
	}, 250)
})

let overlayElementTimeout = null

document.body.appendChild(overlayElement)

function removeNewLines(str) {
	while (str.indexOf('\n') > -1) {
		str = str.replace('\n', '')
	}

	return str
}

function onAdd() {
	let person = {
		first: null,
		last: null,
		email: null,
		phone: null,
		position: null,
		company: null,
		industry: null,
		location: null,
		education: null,
		hometown: null,
		notes: null
	}

	const nameElement = document.querySelector('.pv-top-card-v3--list')
	if (nameElement) {
		const nameLine = nameElement.querySelector('li')
		if (nameLine){
			const name = removeNewLines(nameLine.textContent)
				.trim()
				.split(' ')
				.filter(part => part.length > 0)

			if (name.length > 0) {
				person.first = name[0]
			}
			if (name.length > 1) {
				person.last = name[name.length - 1]
			}
		}
	}

	const generalLocationElement = document.querySelector('.pv-entity__location')
	if (generalLocationElement) {
		person.location = removeNewLines(generalLocationElement.textContent).replace('Location', '').trim()
	}

	const experienceSection = document.querySelector('#experience-section')
	console.log(experienceSection)
	if (experienceSection) {
		const topElement = experienceSection.querySelector('li')
		if (topElement) {
			console.log(topElement)
			const positionElement = topElement.querySelector('h3')
			if (positionElement) {
				person.position = removeNewLines(positionElement.textContent).trim()
			}


			// Company has 2 lines, 1st is hidden
			const companyElement = topElement.querySelectorAll('p')
			console.log(companyElement)
			if (companyElement) {
				person.company = removeNewLines(companyElement[1].textContent).trim()
			}

			const h4Elements = Array.from(topElement.querySelectorAll('h4'))
			/*
			if (h4Elements.length > 0) {
				person.company = removeNewLines(h4Elements[0].textContent).replace('Company Name', '').trim()
			}
			*/
			if (h4Elements.length > 1) {
				const locationElement = h4Elements.filter(element => element.textContent.indexOf('Location') > -1)
				if (locationElement.length) {
					person.location = removeNewLines(locationElement[0].textContent).replace('Location', '').trim()
				}
			}
		}
	}
	console.log(person)

	const educationSection = document.querySelector('#education-section')
	if (educationSection) {
		const topElement = educationSection.querySelector('li')
		if (topElement) {
			const schoolElement = topElement.querySelector('h3')
			if (schoolElement) {
				const educationDetail = Array.from(schoolElement.parentElement.querySelectorAll('p'))
					.map(element => removeNewLines(element.textContent).replace('Degree Name', '').replace('Field Of Study', '').replace('Grade', '').trim())
					.join(', ')
					.trim()
				if (educationDetail.length > 0) {
					person.education = `${educationDetail} - ${removeNewLines(schoolElement.textContent).trim()}`
				}
				else {
					person.education = removeNewLines(schoolElement.textContent).trim()
				}
			}
		}
	}

	const linksSection = document.querySelector('.msg-overlay-bubble-header__settings-links')
	if (linksSection) {
		Array.from(linksSection.querySelectorAll('a'))
			.filter(element => (element.href || '').indexOf('/detail/contact-info') > -1)
			.forEach(element => element.click())
	}

	setTimeout(() => {
		const contactInfoSection = document.querySelector('.pv-contact-info')
		if (contactInfoSection) {
			const emailElement = contactInfoSection.querySelector('.ci-email div')
			if (emailElement) {
				person.email = removeNewLines(emailElement.textContent).trim()
			}
		}

		const dismissButton = document.querySelector('.artdeco-modal__dismiss')
		if (dismissButton) {
			dismissButton.click()
			dismissButton.click()
		}

		chrome.runtime.sendMessage({
			_type: 'addPerson',
			person
		})

		overlayTextElement.innerHTML = `Got the info! Open the <b>CatsWork</b> extension to finish adding <b style='color: #85ccb9'>${person.first} ${person.last}</b>.`
		overlayElement.classList.add('catswork_inject_overlay_active')
		setTimeout(() => {
			overlayTextElement.classList.add('catswork_inject_overlay_active')
		}, 0)

		overlayElementTimeout = setTimeout(() => {
			overlayTextElement.classList.remove('catswork_inject_overlay_active')
			setTimeout(() => {
				overlayElement.classList.remove('catswork_inject_overlay_active')
			}, 250)
		}, 5000)
	}, 500)
}

function load() {
	i++
	if (i > 20) {
		clearInterval(interval)
	}

	// let actionsContainer = document.querySelector('.pv-top-card-v3__distance-badge')
	let actionsContainer = document.querySelector('#ember51')

	const injectButton = document.querySelector('#catswork_inject_button')

	if (actionsContainer) {
		clearInterval(interval)

		if (injectButton) {
			injectButton.remove()
		}

		const button = document.createElement('button')
		button.id = 'catswork_inject_button'
		if (actionsContainer.classList.contains('mt4')) {
			button.classList.add('catswork_mt4')
		}

		const image = document.createElement('img')
		image.src = chrome.runtime.getURL('images/icon128.png')

		button.innerHTML = `add to`;

		button.appendChild(image)

		button.addEventListener('click', onAdd)

		// actionsContainer.append(button)
		actionsContainer.prepend(button)
	}
}

let i = 0
let interval = setInterval(load, 100)
load()

let url = window.location.href

setInterval(function () {
	if (window.location.href !== url) {
		clearInterval(interval)
		i = 0
		interval = setInterval(load, 100)
		load()

		url = window.location.href
	}
}, 100)
