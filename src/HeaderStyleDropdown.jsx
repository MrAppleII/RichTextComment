import React from "react"
import styled from 'styled-components'
class HeaderStyleDropdown extends React.Component {
  onToggle = event => {
    let value = event.target.value
    this.props.onToggle(value)
  }

  render() {
    return (
      <Selector value={this.props.active} onChange={this.onToggle}>
        <option disabled={true} value="">Header Levels</option>
        {this.props.headerOptions.map(heading => {
          return <option key={heading.style} value={heading.style}>{heading.label}</option>
        })}
      </Selector>
    )
  }
}
const Selector = styled.select`
flex-shrink:1;
width:auto;
`

export default HeaderStyleDropdown
