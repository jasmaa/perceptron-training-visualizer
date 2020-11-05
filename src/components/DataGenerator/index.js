import React, { useState } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default function DataGenerator({ generate }) {

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <ButtonDropdown direction="down" isOpen={isOpen} toggle={toggle}>
      <DropdownToggle caret>
        Generate Data
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => generate('linear')}>Linear</DropdownItem>
        <DropdownItem onClick={() => generate('circle')}>Circle</DropdownItem>
        <DropdownItem onClick={() => generate('random')}>Random</DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );
}