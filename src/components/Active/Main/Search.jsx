import { observable, computed, action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router-dom'

import Input from 'ui/Input'

import s from './search.less'

@observer
class Search extends React.Component {

	_people

	_searchInput
	_blurTimeout

	@observable _$search = ''
	@observable _$focused = false

	@computed get _$people() {
		if (this._$search.length < 2) {
			return []
		}

		return this._people
			.filter(person => person.name.toLowerCase().indexOf(this._$search.toLowerCase()) > -1 || person.company.toLowerCase().indexOf(this._$search.toLowerCase()) > -1)
			.sort((a, b) => {
				// Order by earlier name index, earlier company index

				const nameIndexA = a.name.toLowerCase().indexOf(this._$search.toLowerCase())
				const nameIndexB = b.name.toLowerCase().indexOf(this._$search.toLowerCase())

				if (nameIndexA === -1 && nameIndexB > -1) {
					return 1
				}
				else if (nameIndexB === -1 && nameIndexA > -1) {
					return -1
				}
				else if (nameIndexA === -1 && nameIndexB === -1) {
					const companyIndexA = a.company.toLowerCase().indexOf(this._$search.toLowerCase())
					const companyIndexB = b.company.toLowerCase().indexOf(this._$search.toLowerCase())

					if (companyIndexA === companyIndexB) {
						return a.name < b.name ? -1 : 1
					}
					else {
						return companyIndexA - companyIndexB
					}
				}
				else if (nameIndexA === nameIndexB) {
					return a.name < b.name ? -1 : 1
				}
				else {
					return nameIndexA - nameIndexB
				}
			})
			.slice(0, 25)
	}

	constructor(props) {
		super(props)

		this._people = this.props.people.map(({ first, last, ...rest }) => ({ name: `${first} ${last}`, ...rest }))
	}

	componentDidMount() {
		this._searchInput.focus()
	}

	render() {
		let content
		if (this._$focused && this._$search.length >= 2) {
			if (this._$people.length) {
				const results = this._$people.map(person => {
					const nameIndex = person.name.toLowerCase().indexOf(this._$search.toLowerCase())
					const nameElement = nameIndex >= 0 ? (
						<>
							{person.name.substring(0, nameIndex)}
							<span className={s.highlight}>{person.name.substring(nameIndex, nameIndex + this._$search.length)}</span>
							{person.name.substring(nameIndex + this._$search.length)}
						</>
					) : person.name

					const companyIndex = person.company.toLowerCase().indexOf(this._$search.toLowerCase())
					const companyElement = companyIndex >= 0 ? (
						<>
							{person.company.substring(0, companyIndex)}
							<span className={s.highlight}>{person.company.substring(companyIndex, companyIndex + this._$search.length)}</span>
							{person.company.substring(companyIndex + this._$search.length)}
						</>
					) : person.company

					return (
						<div className={s.result} onClick={this._onSelect.bind(null, person.personId)}>
							<h4 className={s.name}>{nameElement}</h4>
							<div className={s.position}>{person.position || 'No position'}</div>
							<div className={s.company}>{companyElement}</div>
						</div>
					)
				})

				content = <div className={s.results} onMouseDown={this._onResultsMouseDown}>{results}</div>
			}
			else {
				content = (
					<div className={s.results} onMouseDown={this._onResultsMouseDown}>
						<div className={s.empty}>No matches<br /><Link to='/add-person' className={s.link}>Add a new person</Link></div>
					</div>
				)
			}
		}
		else {
			content = null
		}

		return (
			<div className={s.search}>
				<Input block
					icon='fas fa-search'
					block
					type='text'
					placeholder='Search by name or company'
					inputRef={input => this._searchInput = input}
					onFocus={this._onSearchFocus}
					onBlur={this._onSearchBlur}
					onChange={this._onSearchChange} />
				{content}
			</div>
		)
	}

	@action
	_onSearchFocus = () => {
		if (!this._$focused) {
			this._$focused = true
		}
	}

	_onSearchBlur = (event) => {
		this._blurTimeout = setTimeout(action(() => {
			this._$focused = false
		}), 10)
	}

	@action
	_onSearchChange = (event) => {
		this._$search = event.currentTarget.value
	}

	@action
	_onResultsMouseDown = () => {
		setTimeout(() => {
			this._searchInput.focus()

			clearTimeout(this._blurTimeout)
		}, 0)
	}

	_onSelect = (id) => {
		console.log(`Id from on Select:`, id)
		this.props.onSelect(id)
	}

}

export default Search
