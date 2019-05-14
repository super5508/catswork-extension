import Http from './Http'

class PeopleTimeline {

	static getPersonTimeline(person) {
		return Http.get(`person/${person}/timeline`)
	}

	static addPersonActivity(person, activity, date) {
		return Http.post('add-person-activity', { person, activity, date })
	}

}

export default PeopleTimeline
