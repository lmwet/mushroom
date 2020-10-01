import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FindPeople() {
    const [newbies, setNewbies] = useState([]);

    useEffect(() => {
        let ignore = false;
        (async () => {
            const { data } = await axios.get("/users/new");
            if (!ignore) {
                setNewbies(data);
            }
        })();
        return () => {
            ignore = true;
        };
    }, []);

    const [query, setQuery] = useState("");
    const [searchResult, setSearch] = useState([]);
    const [noMatch, setNomatch] = useState(false);

    useEffect(() => {
        let ignore = false;
        console.log("useEffect setsearch runnin");
        if (query) {
            (async () => {
                const { data } = await axios.get(`/users/query/?q=${query}`);
                if (!ignore) {
                    console.log("data in getSearch", data);
                    setSearch(data);
                }
                if (data.length == 0) {
                    setNomatch(true);
                }
            })();

            return () => {
                console.log("searchies clean up function");
                ignore = true;
            };
        }
    }, [query]);

    const [displayUsers, setDisplay] = useState("landing");

    const displayFindPeople = () => {
        if (displayUsers == "landing") {
            return (
                <React.Fragment>
                    <h1>New in BAM</h1>
                    {newbies.map((elem) => {
                        return (
                            <div key={elem.id}>
                                <img src={elem.url} />
                                <Link to={`/user/${elem.id}`}>
                                    <p>
                                        {elem.first} {elem.last}
                                    </p>
                                </Link>
                            </div>
                        );
                    })}

                    <h1>Find someone special</h1>
                    <input
                        name="open-finder"
                        placeholder="Enter a name"
                        onFocus={() => {
                            setDisplay("searchByName");
                        }}
                    />
                </React.Fragment>
            );
        } else if (displayUsers == "searchByName") {
            return (
                <React.Fragment>
                    <h1>Find someone in BAM</h1>
                    {noMatch && <div>Sorry, no match</div>}
                    <input
                        name="find-person"
                        placeholder="Enter a name"
                        onChange={(e) => {
                            setQuery(e.target.value);
                            console.log("query", e.target.value);
                        }}
                    />

                    {searchResult.map((elem) => {
                        return (
                            <div key={elem.id}>
                                <img src={elem.url} />
                                <Link to={`/user/${elem.id}`}>
                                    <p>
                                        {elem.first} {elem.last}
                                    </p>
                                </Link>
                            </div>
                        );
                    })}
                </React.Fragment>
            );
        }
    }; //displayF

    return displayFindPeople();
} //end cpnt
