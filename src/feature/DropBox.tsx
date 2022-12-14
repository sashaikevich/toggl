import { useState, useRef, ChangeEvent } from "react"
import styled from "styled-components"
import { BiCloudUpload } from "react-icons/bi"

interface DropBoxProps {
  handleFileChange: (files: FileList) => void
}
const DropBox = ({ handleFileChange }: DropBoxProps) => {
  const [canDrop, setCanDrop] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    handleFileChange(e.dataTransfer.files)
    setCanDrop(false)
    // onChange(e)
  }
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setCanDrop(true)
  }
  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setCanDrop(false)
  }

  return (
    <>
      <StyledDropBox
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        canDrop={canDrop}>
        <div>
          <StyledUpload>
            <BiCloudUpload />
          </StyledUpload>
          <h5>Drop files here to process them</h5>
          <span>or</span>
          <button
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.click()
              }
            }}>
            browse
          </button>
        </div>
      </StyledDropBox>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept=".txt"
        multiple
        required
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files) {
            handleFileChange(e.target.files)
          }
        }}
      />
    </>
  )
}

export default DropBox

const StyledDropBox = styled.div<{ canDrop: boolean }>`
  text-align: center;
  border: 4px dashed rgba(56, 126, 238, ${props => (props.canDrop ? 0.4 : 0.2)});
  background-color: ${props =>
    props.canDrop ? "rgba(56, 126, 238, 0.05)" : "transparent"};
  border-radius: 0.5em;
  display: flex;
  justify-content: center;
  padding: 3em 2em;
  margin-bottom: 2em;
  span {
    display: block;
    margin-bottom: 1em;
  }
  h5 {
    line-height: 1;
    font-weight: 700;
    font-size: 1.1em;
    margin: 0 0 1em;
    padding: 0;
    text-transform: uppercase;
    color: rgba(56, 126, 238);
  }
  button {
    background-color: rgb(56, 126, 238);
    color: #fff;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 0.9em;
    padding: 0.5em 1em;
    border-radius: 9999px;
    letter-spacing: 0.03em;
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
  }
`
const StyledUpload = styled.div`
  width: 3em;
  height: 3em;
  display: inline-block;
  svg {
    width: 100%;
    height: auto;
    fill: rgba(56, 126, 238, 0.8);
  }
`
