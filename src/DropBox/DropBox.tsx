import { useState, useRef, ChangeEvent, forwardRef } from "react"
import { StyledDropBox, StyledUpload } from "./DropBox.style"
import { BiCloudUpload } from "react-icons/bi"

interface DropBoxProps {
  handleFileChange: (files: FileList) => void
}

const DropBox = forwardRef<HTMLFormElement, DropBoxProps>(
  ({ handleFileChange }, ref) => {
    const [canDrop, setCanDrop] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
      e.preventDefault()
      e.stopPropagation()
      handleFileChange(e.dataTransfer.files)
      setCanDrop(false)
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
          canDrop={canDrop}
          aria-label="droparea">
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
        <form ref={ref}>
          <input
            ref={inputRef}
            aria-label="upload"
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
        </form>
      </>
    )
  }
)

DropBox.displayName = "DropBox"

export default DropBox
