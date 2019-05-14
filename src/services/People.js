import Http from './Http'

class People {

	static addPerson(first, last, company, position, email, phone, location) {
		return Http.post('add-person', { first, last, company, position, email, phone, location })
	}

	static getPeople() {
		return Http.get('people')
	}

	static getPerson(person) {
		return Http.get(`person/${person}`)
	}

}

export default People
