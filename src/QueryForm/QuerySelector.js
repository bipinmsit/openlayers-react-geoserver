import React, { useState } from "react";
import { Nav } from "react-bootstrap";

const QuerySelector = (props) => {
  return (
    <div>
      <div>
        <Nav fill variant="tabs">
          <Nav.Item as="li">
            <Nav.Link eventKey="link-1" onSelect={props.attribute}>
              Select by attribute
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as="li">
            <Nav.Link eventKey="link-2" onSelect={props.location}>
              Select by location
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </div>
  );
};

export default QuerySelector;
