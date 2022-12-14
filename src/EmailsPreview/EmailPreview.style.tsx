import styled from "styled-components"

export const StyledControls = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

export const StyledControlButton = styled.div<{ isSelected: boolean }>`
  display: inline-flex;
  width: 2em;
  height: 2em;
  justify-content: center;
  align-items: center;
  border: 1px solid #f1f1f1;
  border-radius: 0.4em;
  cursor: pointer;
  &:hover {
    border-color: rgba(56, 126, 238, 0.2);
  }
  background-color: ${props =>
    props.isSelected ? "rgba(56, 126, 238, 0.2)" : "transparent"};
`

export const StyledData = styled.section`
  display: grid;
  grid-template-columns: 20em 1fr;
  grid-gap: 3em;
  margin-bottom: 3em;
  h3 {
    font-weight: 600;
    font-size: 0.9em;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
`

export  const StyledFileTag = styled.div`
  border: 1px solid #f1f1f1;
  display: inline-block;
  padding: 0.25em 0.5em;
  margin-bottom: 0.5em;
  border-radius: 0.4em;
  transition: border-color 200ms ease-out;
  .emails-total {
    color: rgba(56, 126, 238);
  }
  &:hover {
    border-color: rgba(56, 126, 238, 0.5);
  }
`

interface EmailRowProps {
  isHighlighted: boolean
  isIncluded: boolean
  hasFailed?: boolean
}

export  const StyledEmailRow = styled.div<EmailRowProps>`
  margin: 0.25em 0;
  background-color: ${props =>
    props.isHighlighted ? "rgba(56, 126, 238, 0.1)" : "unset"};
  transition: background-color 200ms ease-out;
  .email-address {
    text-decoration: ${props => (!props.isIncluded ? "line-through" : "unset")};
    opacity: ${props => (!props.isIncluded ? "0.5" : "unset")};
    color: ${props => (props.hasFailed ? "red" : "unset")};
  }
`

export const StyledSend = styled.div`
  text-align: center;

  button {
    background-color: rgb(56, 126, 238);
    color: #fff;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 0.9em;
    font-size: 1.1em;
    padding: 0.5em 1em;
    border-radius: 9999px;
    letter-spacing: 0.03em;
    cursor: pointer;
    display: inline-block;
    &:hover {
      opacity: 0.9;
    }
  }
`