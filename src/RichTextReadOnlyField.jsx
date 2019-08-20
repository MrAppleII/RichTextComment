import React, { Component } from "react"
import {
  Editor,
  EditorState,
  CompositeDecorator,
  convertFromRaw,
} from "draft-js"
import "draft-js/dist/Draft.css"
import styled from "styled-components"

class RichTextOnlyField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState:  EditorState.createEmpty(),
    }
  
  }
  componentDidMount() {
    this.setNewEditorStateFromRaw(this.props.value)
      
  }
  setNewEditorStateFromRaw = (data) =>{
    try{
        // This is used for reading the links only. 
        const LinkDecorator = new CompositeDecorator([
          {
            strategy: this.linkStrategy,
            component: this.Link,
          },
        ]);
        if(data!==undefined && data!==null){
            let JsonData = convertFromRaw(JSON.parse(data))
            this.setState({
             editorState: EditorState.createWithContent(JsonData, LinkDecorator),
           })
      
        }
      
         }catch(e){
            if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
                console.log(e)
              }
         }
  }
  componentDidUpdate(prevProps){
      if(prevProps.value!==this.props.value){
          if(this.props.value!==undefined&&this.props.value!==null){
            this.setNewEditorStateFromRaw(this.props.value)
          }
      }
  }
  focus = () => {
    this.refs.editor.focus()
  }
  componentWillUnmount() {}

  linkStrategy = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(character => {
      const entityKey = character.getEntity()
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === "LINK"
      )
    }, callback)
  }
  Link = props => {
    const { contentState, entityKey } = props
    const { url } = contentState.getEntity(entityKey).getData()
    var finalUrl = ""
    if (url.startsWith("https://") || url.startsWith("http://")) {
      finalUrl = url
    } else {
      finalUrl = "https://" + url
    }

    return (
      <a
        href={finalUrl}
        rel="noopener noreferrer"
        target="_blank"
        aria-label={finalUrl}
      >
        {props.children}
      </a>
    )
  }
  render() {
    try {
      return (
        <TextFieldContainer {...this.props}>
          <Editor
           
            editorState={this.state.editorState}
            decorators={this.LinkDecorator}
            spellCheck={false}
            readOnly={true}
            onFocus={this.focus}
            placeholder={this.props.placeholder}
            autocomplete={false}
            stripPastedStyles={false}
            ref="editor"
          />
        </TextFieldContainer>
      )
    } catch (e) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
      }
      return null
    }
  }
}
const TextFieldContainer = styled.div`
  width: 100%;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`
export default RichTextOnlyField
