import React, { Component } from "react"
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js"
import addLinkPlugin from "./addLinkPlugin"
import Editor from "draft-js-plugins-editor"
import styled, { keyframes } from "styled-components"
import PropTypes from "prop-types"
import BlockStyleToolbar, { getBlockStyle } from "./BlockStyleToolbar"
import DropdownMenu from "./DropdownMenu"
import 'draft-js/dist/Draft.css';
/*
    File: RichTextArea.jsx
    Author: Jesus Garnica 2019
    Description: Creates a rich text areas using Draft.js. Uses RichUtils to provide the bulk of the features. 
    Use CMD+I, CMD+B, CMD+Z to italicize, bold, and undo respectively. It also copies 
    the styles that were pasted from HTML. 
*/

class RichTextArea extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isMaximized: false,
      textContents: undefined,
      editorState: EditorState.createEmpty(),
      linkMenuVisible: false,
      linkTextBoxValue: "",
    }
  }
  onChange = (editorState) =>{
    this.setState({
        editorState:editorState,
    })
    // Lets run the onChange function. But we also need to type check.
    if(this.props.onChange!==undefined && typeof(this.props.onChange) === "function"){
      let textContents = { content: convertToRaw(this.state.editorState.getCurrentContent()) }
      textContents["content"] = JSON.stringify(textContents.content)  
      this.props.onChange(textContents)
    }else{
   //     this.props.onChange(editorState)
    }
  }
  componentDidMount() {
    // 8-18-2019
    if (this.props.value !== undefined) {
      let JsonData = convertFromRaw(JSON.parse(this.props.value))
      this.setState({
        editorState: EditorState.createWithContent(JsonData),
      })
    }
  }
  componentWillUnmount() {}

  focus = () => {
    this.setState({
      isMaximized: true,
    })
    this.refs.editor.focus()
  }
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
  onHandleLinkTextInput = e => {
    this.setState({
      linkTextBoxValue: e.target.value,
    })
  }
  onAddLink = () => {
    const editorState = this.state.editorState
    const selection = editorState.getSelection()

    const link = this.state.linkTextBoxValue
    this.setState({
      linkMenuVisible: false,
      linkTextBoxValue: "",
    })
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
  onBlur = () => {
    
    let contentState = this.state.editorState.getCurrentContent()
    if(contentState.hasText()===false){
        // This means we have no text in the field currently
        this.setState({
            isMaximized: false,
        })
    }
    let textContents = { content: convertToRaw(contentState) }
    textContents["content"] = JSON.stringify(textContents.content)
    this.setState({
      textContents: textContents,
    },()=>{
         // Lets run the onChange function. But we also need to type check.
    if(this.props.onBlur!==undefined && typeof(this.props.onBlur) === "function"){
      this.props.onBlur(this.state.textContents)
  }else{
 //     this.props.onChange(editorState)
  }
    })
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
  handleOpeningLinkMenu = () => {
    this.setState({
      linkMenuVisible: !this.state.linkMenuVisible,
    })
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
    this.props.handleDescriptionChange(textContents["content"]) //8-18-2019
    this.setState({
      textContents: textContents,
    })
  }
  /******************************************************************* */

  handleCancelButton = () => {
    this.setState({
      editorState:EditorState.createEmpty(),
      isMaximized: false,
    })
  }

  render() {
    try {
      return (
        <ColumnLayout>
          <BorderWrapper>
            {this.state.isMaximized === true ? (
              <ToolBelt>
                {/* Items for controlling the text box go in here. */}
                <RowLayout>
                  <ToolBeltButton onClick={this.onBoldClick}>
                    <div>
                      <b>B</b>
                    </div>
                  </ToolBeltButton>
                  <ToolBeltButton onClick={this.onItalicClick}>
                    <em>I</em>
                  </ToolBeltButton>
                  <ToolBeltButton onClick={this.onUnderlineClick}>
                    U
                  </ToolBeltButton>
                  <DropdownMenuHolder>
                    <ToolBeltButton
                      
                      className={this.state.linkMenuVisible===true? "active" : ""}
                      onClick={this.handleOpeningLinkMenu}
                    >
                      <svg
                        width="18px"
                        height="18px"
                        version="1.1"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m42.223 83.234c-7.0156 7.0156-18.441 7.0156-25.457 0s-7.0156-18.441 0-25.457l14.141-14.141c7.0156-7.0156 18.441-7.0156 25.457 0 0.57422 0.55859 0.90234 1.3242 0.91016 2.1289 0.003906 0.80078-0.3125 1.5742-0.87891 2.1406-0.57031 0.57031-1.3398 0.88672-2.1445 0.87891-0.80078-0.003906-1.5703-0.33203-2.1289-0.90625-4.7383-4.7383-12.234-4.7383-16.969 0l-14.141 14.141c-4.7383 4.7383-4.7383 12.234 0 16.969 4.7383 4.7383 12.234 4.7383 16.969 0l13.434-13.434c0.55859-0.57422 1.3281-0.90234 2.1289-0.90625 0.80469-0.007813 1.5742 0.30859 2.1445 0.87891 0.56641 0.56641 0.88281 1.3359 0.87891 2.1406-0.007812 0.80469-0.33594 1.5703-0.91016 2.1289l-13.434 13.434zm26.871-26.871c-7.0156 7.0156-18.441 7.0156-25.457 0-0.57422-0.55859-0.90234-1.3281-0.91016-2.1289-0.003906-0.80469 0.3125-1.5742 0.87891-2.1445 0.57031-0.56641 1.3398-0.88281 2.1445-0.87891 0.80078 0.007812 1.5703 0.33203 2.1289 0.91016 4.7383 4.7383 12.234 4.7383 16.969 0l14.141-14.141c4.7383-4.7383 4.7383-12.234 0-16.969-4.7383-4.7383-12.234-4.7383-16.969 0l-13.434 13.434v-0.003906c-0.55859 0.57812-1.3281 0.90625-2.1289 0.91016-0.80469 0.003907-1.5742-0.3125-2.1445-0.87891-0.56641-0.56641-0.88281-1.3398-0.87891-2.1406 0.007812-0.80469 0.33594-1.5703 0.91016-2.1328l13.434-13.434c7.0156-7.0156 18.441-7.0156 25.457 0s7.0156 18.441 0 25.457z" />
                      </svg>
                    </ToolBeltButton>

                    <DropdownMenu
                      onMenuClose={this.handleOpeningLinkMenu}
                      isVisible={this.state.linkMenuVisible}
                    >
                       <form onSubmit={this.onAddLink}>
                      <LinkButtonLayout>
                     
                        <LinkTextField
                          placeholder="Paste Link"
                          value={this.state.linkTextBoxValue}
                          onChange={this.onHandleLinkTextInput}
                        />
                        <LinkConfirmButton
                          disabled={
                            this.state.linkTextBoxValue === "" ? true : false
                          }
                          onClick={this.onAddLink}
                        >
                          OK
                        </LinkConfirmButton>
                       
                      </LinkButtonLayout>
                      </form>
                    </DropdownMenu>
                  </DropdownMenuHolder>
                  <Separator />
                  <BlockStyleToolbar
                    editorState={this.state.editorState}
                    onToggle={this.toggleBlockType}
                  />
                </RowLayout>
              </ToolBelt>
            ) : null}

            <MainContainer>
              <div className={"editors"}>
                <EditorContainer
                  className={this.state.isMaximized === true ? "isActive" : ""}
                  style={this.props.style}
                >
                  <Editor
                    blockStyleFn={getBlockStyle}
                    editorState={this.state.editorState}
                    onChange={this.onChange}
                    spellCheck={true}
                    onFocus={this.focus}
                    placeholder={this.props.placeholder}
                    autocomplete={false}
                    onBlur={this.onBlur}
                    stripPastedStyles={this.props.stripPastedStyles}
                    plugins={[addLinkPlugin]}
                    onClick={this.focus}
                    handleKeyCommand={this.handleKeyCommand}
                    ref="editor"
                  />
                </EditorContainer>
              </div>
            </MainContainer>
          </BorderWrapper>
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

RichTextArea.propTypes = {
    placeholder: PropTypes.string,
    stripPastedStyles: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
  }
  RichTextArea.defaultProps = {
      value: undefined,
      placeholder:"", 
      stripPastedStyles: false,
      onBlur: ()=>{},
     onChange: ()=>{},
 
  }
const FadeIn = keyframes`
from{
opacity:0;
}
to{
    opacity:1;
}
`


const BorderWrapper = styled.div`
  width: 100%;
  border-radius: 3px;
  border: 1px solid rgb(223, 225, 230);
  
  animation: ${FadeIn} 0.4s ease-out;

`

const LinkTextField = styled.input`
  line-height: 1em;
  border-radius: 2px;
  border: 1px solid rgba(200, 200, 200, 0);
  flex-grow: 1;
  outline: none;
  :focus {
    border: 1px solid rgba(57, 125, 255, 0);
  }
`

const LinkConfirmButton = styled.button`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  cursor: pointer;
  color: rgb(57, 125, 255);
  font-size: 16px !important;
  background: transparent;
  outline: none;
  border: 1px solid transparent;
  :disabled {
    opacity: 0.6;
  }
`
const Separator = styled.span`
  width: 1px;
  height: 24px;
  background: rgb(235, 236, 240);
  margin: 0px 8px;
`
const LinkButtonLayout = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`

const MainContainer = styled.div`
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`
const DropdownMenuHolder = styled.div`
  height: 100%;
  margin: 0;
  width: 30px;
  
`
const EditorContainer = styled.div`
  min-height: 1em;
  font-size: 16px;
  font-weight: normal;
  padding: 0.5em 20px;
  max-height: 150px;
  height: auto;
  width:100%;
  max-width:100%;
  border-radius: 2px;
  overflow-y: scroll;
  &.isActive {
    min-height: 100px;
  }
`
const RowLayout = styled.div`
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  vertical-align: baseline;
  padding: 0 16px;
`

const ToolBelt = styled.div`
  width: 100%;

  display: inline-flex;
  flex-direction: row;
  margin-top: 10px;
  margin-bottom: 10px;
  align-self: center;
  align-items: center;
  justify-content: space-between;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  animation: ${FadeIn} 0.4s ease-out;
`
const ToolBeltButton = styled.span`
  border: none;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  outline: none;
  height: 100%;
  width: 30px;
  height: 30px;
  padding: 0px 0px;
  border: 0;
  margin: 0 2px;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.1s ease-out;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background: white;
  :hover {
    background: rgba(225, 225, 225, 1);
  }
  &.active {
    background: rgba(225, 225, 225, 1);
  }
  &.lastItem {
    border-right: 1px solid rgba(237, 237, 237, 0);
  }
`
const ColumnLayout = styled.div`
  width: 100%;
  display: flex;
  padding: 0px 0px;
  margin: 20px auto;

  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
`
export default RichTextArea
