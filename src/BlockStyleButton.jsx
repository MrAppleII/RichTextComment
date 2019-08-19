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
       {(this.props.logoPath!=="" && this.props.logoPath !== undefined)?
    (<svg width={this.props.iconSize+`px`} height={this.props.iconSize+`px`} version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g>
    {this.props.logoPath}
    </g>
   </svg>)
    :this.props.label
    }
        
      </BlockLabel>
    )
  }
}
const BlockLabel = styled.button`
  border: none;
  outline: none;
 
 
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;

   padding: 0;

  min-width: 30px;
  height: 30px;
  margin: 0 2px;
 border:0;
    border-radius:3px;
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
 

`

export default BlockStyleButton
