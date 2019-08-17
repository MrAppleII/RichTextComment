import React from "react"
import styled from "styled-components"
class BlockStyleButton extends React.Component {
  onToggle = e => {
    e.preventDefault()
    this.props.onToggle(this.props.style)
  }

  render() {
    let className = ""
    if (this.props.active) {
      className += "active"
    }

    return (
      <BlockLabel className={className} onClick={this.onToggle}>
        {this.props.label}
      </BlockLabel>
    )
  }
}
const BlockLabel = styled.button`
  border: none;
  outline: none;
  text-align: center;
  width: 40px;
  border-right: 1px solid rgba(237, 237, 237, 1);
  border-left: 1px solid rgba(237, 237, 237, 0);

  cursor: pointer;
  transition: background 0.1s ease-out;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background: white;
  :hover {
    background: rgba(225, 225, 225, 1);
  }
  &.active{
    background: rgba(225, 225, 225, 1);
  }
  &.lastItem {
    border-right: 1px solid rgba(237, 237, 237, 0);
  }

`

export default BlockStyleButton
