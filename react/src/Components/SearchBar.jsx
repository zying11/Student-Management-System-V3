import React from "react";
import { Form } from "react-bootstrap";
import { InputGroup, FormControl } from "react-bootstrap";
import Button from "../components/Button/Button";
import { BsSearch } from "react-icons/bs";

export default function SearchBar({
    searchQuery,
    setSearchQuery,
    placeholder,
}) {
    return (
        <Form>
            <InputGroup className="mb-3">
                <FormControl
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={placeholder || "Search"}
                    aria-label={placeholder || "Search"}
                />
                <Button
                    className="btn-create-yellow"
                    type="submit"
                    variant="primary"
                    disabled
                >
                    <BsSearch />
                </Button>
            </InputGroup>
        </Form>
    );
}