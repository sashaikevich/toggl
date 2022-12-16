import styled from "styled-components"
const Loading = () => {
  return (
    <StyledLoading>
      <span>Loading...</span>
    </StyledLoading>
  )
}

export default Loading

const StyledLoading = styled.div`
  position: absolute;
  inset: 0;
  padding-top: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
`
