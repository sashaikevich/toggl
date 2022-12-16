import styled from "styled-components"
const Loading = () => {
  return <StyledLoading>Loading...</StyledLoading>
}

export default Loading

const StyledLoading = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: centers;
  border: 2px solid rebeccapurple;
`
