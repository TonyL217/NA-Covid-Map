import React from 'react'

const HoverDetail = ({name,covidCount}) => {
  return (
    <div>State: {name} <br/> cases: {covidCount}</div>
  )
}

export default HoverDetail