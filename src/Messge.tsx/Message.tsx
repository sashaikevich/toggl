import styled from "styled-components"

interface MessageProps {
  errorCode?: number
  successCode?: number
}
const Message = ({ errorCode, successCode }: MessageProps) => {
  if (successCode) {
    return (
      <StyledMsg variant="success">
        All emails sent successfully ! (status: {successCode})
      </StyledMsg>
    )
  }
  if (errorCode) {
    return (
      <StyledMsg variant="failed">
        Some email(s) were not sent ! (error: {errorCode})
      </StyledMsg>
    )
  }
  return null
}

export default Message

const StyledMsg = styled.div<{ variant: "success" | "failed" }>`
  text-align: center;
  z-index: -1;
  position: absolute;
  inset: 1em 0 0 0;
  color: ${props => (props.variant === "success" ? "green" : "red")};
`
