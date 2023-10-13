import { styled } from 'styled-components'

const P = styled('p')`
  color: red;
`

export function EMsg(props) {
  return <P {...props} />
}
