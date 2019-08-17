# 

# Example of Usage

```
import RichTA from '../components/CustomTextArea/RichTextArea'

const IndexPage = () => (
  <PageBody >
  
   
   <RichTA />
   
   
  
  </PageBody>
)
```
# Converting JSON back to text 

```
  editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.note.content)))
```

# WIP 

There will be a prop to handle on submit and cancel functions. 
Links will be able to be added. 
Emojis will be in their own container. 
