import React, { Component } from "react"
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js"
import addLinkPlugin from "./addLinkPlugin"
import Editor from "draft-js-plugins-editor"
import styled, {keyframes} from 'styled-components'
import linkIcon from "./link_icon.png"
import BlockStyleToolbar, { getBlockStyle } from "./BlockStyleToolbar"
/*
    File: RichTextArea.jsx
    Author: Jesus Garnica 2019
    Description: Creates a rich text areas using Draft.js. Uses RichUtils to provide the bulk of the features. 
    Use CMD+I, CMD+B, CMD+Z to italicize, bold, and undo respectively. 
*/


class RichTextArea extends Component {
  constructor(props) {
    super(props)

    this.state = {
        isMaximized: false, 
        textContents: undefined,
        editorState: EditorState.createEmpty() 
    }
    this.onChange = editorState => this.setState({ editorState })
  }
  componentDidMount() {}
  componentWillUnmount() {}
  
  focus = () => {
    this.setState({
        isMaximized:true,
    })
    console.log("is focused")
      this.refs.editor.focus()
    }  ;
  handleKeyCommand = (command, editorState) => {
    let newState
    newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.onChange(newState)
      return "handled"
    }
    return "non-handled"
  }
  onUnderlineClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE")
    )
  }
  onAddLink = () => {
    const editorState = this.state.editorState
    const selection = editorState.getSelection()
    const link = window.prompt("Paste the link -")
    if (!link) {
      this.onChange(RichUtils.toggleLink(editorState, selection, null))
      return "handled"
    }
    const content = editorState.getCurrentContent()
    const contentWithEntity = content.createEntity("LINK", "MUTABLE", {
      url: link,
    })
    const newEditorState = EditorState.push(
      editorState,
      contentWithEntity,
      "create-entity"
    )
    const entityKey = contentWithEntity.getLastCreatedEntityKey()
    this.onChange(RichUtils.toggleLink(newEditorState, selection, entityKey))
    return "handled"
  }

  onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"))
  }

  onItalicClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC"))
  }
  toggleBlockType = blockType => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }
  /******************************************************************* */
  /*
    Here we are saving the actual contents of what is in the box. This is what 
    should be posted to the backend.
  */
  submitEditor = () => {
    let contentState = this.state.editorState.getCurrentContent()
    let textContents = { content: convertToRaw(contentState) }
    textContents["content"] = JSON.stringify(textContents.content)
    this.setState({
        textContents: textContents,
    })
  }
   /******************************************************************* */

  handleCancelButton = () =>{
      this.setState({
          isMaximized:false,
      })
  }
  

  render() {
    try {
      return (
        <ColumnLayout>
          { this.state.isMaximized===true? (<ToolBelt>
            {/* Items for controlling the text box go in here. */}
            <RowLayout>
              <ToolBeltButton onClick={this.onBoldClick}>
                <b>B</b>
              </ToolBeltButton>
              <ToolBeltButton onClick={this.onItalicClick}>
                <em>I</em>
              </ToolBeltButton>
              <ToolBeltButton onClick={this.onUnderlineClick}>U</ToolBeltButton>
              <LinkButton className="lastItem" onClick={this.onAddLink}>
               <i>
               <img
                  src={linkIcon}
                  alt="make link"
                  width="18px"
                  height="auto"
                 
                />
               </i>
               
               
              </LinkButton>
            </RowLayout>

            <BlockStyleToolbar
              editorState={this.state.editorState}
              onToggle={this.toggleBlockType}
            />
          </ToolBelt>) : null}

          <MainContainer>
            <div className={"editors"}>
              <EditorContainer
                className={this.state.isMaximized===true? "isActive" : ""}
                style={{ border: "1px solid #ddd", width: "100%" }}
              >
                <Editor
                  blockStyleFn={getBlockStyle}
                  editorState={this.state.editorState}
                  onChange={this.onChange}
                  spellCheck={true}
                  onFocus={this.focus}
                  plugins={[addLinkPlugin]}
                  onClick={this.focus}
                  handleKeyCommand={this.handleKeyCommand}
                  ref="editor"
                />
              </EditorContainer>
            </div>
          </MainContainer>
          { this.state.isMaximized===true? (
          <BottomButtonContainer>
            <SubmitButton onClick={this.submitEditor}>Save</SubmitButton>
            <SubmitButton
              style={{ margin: "auto 10px" }}
              className="cancel"
              onClick={this.handleCancelButton}
            >
              Cancel
            </SubmitButton>
          </BottomButtonContainer>) : null}
        </ColumnLayout>
      )
    } catch (e) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
      }
      return null
    }
  }
}
const FadeIn = keyframes`
from{
opacity:0;
}
to{
    opacity:1;
}
`

const BottomButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  align-content: center;
  justify-content: flex-start;
  width: 100%;
  animation: ${FadeIn} 0.4s ease-out ;
`
const SubmitButton = styled.button`
  border: none;
  outline:none;
  background: rgb(57, 125, 255);
  color: white;
  padding: 2px 8px;
  transition: all 0.1s ease-out;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &.cancel {
    background: transparent;
    color: black;
    :hover {
      background: rgba(38, 38, 38, 0.25);
    }
  }
  :hover {
    background-color: rgb(31, 109, 255);
  }
`
const MainContainer = styled.div`
 
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`
const EditorContainer = styled.div`
  padding: 0.5em;
  min-height: 1em;
  max-height: 150px;
  height:auto;
  border-radius: 2px;
  overflow-y: scroll;
  :hover{
    border: 1px solid rgba(207, 207, 207, 1);
  }
  &.isActive{
    min-height: 100px;
  }
`
const RowLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  border: 1px solid rgba(237, 237, 237, 1);
  
`
const LinkButton = styled.span`
  border: none;
  outline: none;
  text-align: center;
  width: 30px;
  border: 0px solid rgba(237, 237, 237, 1);
  height:100%;
  padding:0;
  display:flex;
  justify-content:center;
  align-content:center;
  align-items:center;
  cursor: pointer;
  transition: background 0.1s ease-out;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background: white;
  :hover {
    background: rgba(225, 225, 225, 1);
  }
  &.lastItem {
  }
`
const ToolBelt = styled.div`
  width: 100%;

  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  align-self: center;
  align-items: center;
  justify-content: space-between;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

    animation: ${FadeIn} 0.4s ease-out ;
`
const ToolBeltButton = styled.button`
  border: none;
  outline: none;
  text-align: center;
  width: 30px;
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
  &.lastItem {
    border-right: 1px solid rgba(237, 237, 237, 0);
  }
`
const ColumnLayout = styled.div`
  width: 100%;
  display: flex;
  padding: 0px 10px;
  margin: 20px auto;

  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
`
export default RichTextArea
