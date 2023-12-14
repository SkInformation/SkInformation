import * as React from "react";
import {useEffect, useMemo} from "react";
import {debounce} from "@mui/material/utils";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

interface SearchBarProps<T extends { id: number; name: string }> {
    name: string;
    selectedValues: T[];
    setSelectedValue: (value: T) => void;
    query: (input: string) => Promise<T[]>;
}

export default function SearchBar<T extends { id: number; name: string }>({
                                                                              name,
                                                                              selectedValues = [],
                                                                              setSelectedValue,
                                                                              query,
                                                                          }: SearchBarProps<T>) {
    const [inputValue, setInputValue] = React.useState<string | undefined>();
    const [options, setOptions] = React.useState<readonly T[]>([]);
    const [dummyKey, setDummyKey] = React.useState<string>('a');

    const fetch = useMemo(
        () =>
            debounce(
                async (
                    request: { input: string },
                    callback: (results?: readonly T[]) => void,
                ) => {
                    const results = await query(request.input);
                    callback(results);
                },
                400,
            ),
        [query],
    );

    useEffect(() => {
        let active = true;

        if (inputValue === '') {
            setOptions([]);
            return undefined;
        }

        void fetch({input: (inputValue || '')}, (results?: readonly T[]) => {
            if (active) {
                let newOptions: readonly T[] = [];

                if (results) {
                    newOptions = [...newOptions, ...results];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [inputValue, fetch]);

    return (
        <Autocomplete
            freeSolo
            clearOnEscape
            clearOnBlur
            id={`${name}-search-bar`}
            sx={{
                width: "100%"
            }}
            key={dummyKey}
            getOptionLabel={(option) => {
                return typeof option === 'string' ? option : option.name
            }}
            filterOptions={(x) => {
                return x.filter((item) => {
                    let itemName = typeof item === 'string' ? item : item.name

                    return !selectedValues.find(({name}) => name === itemName);
                })
            }}
            options={options}
            noOptionsText="No products found"
            onChange={(_event: any, newValue: string | T | null) => {
                if (!newValue || typeof newValue === 'string') {
                    return;
                }

                setDummyKey(prevState => prevState === 'a' ? 'b' : 'a');
                setInputValue(''); // Clear input value
                setOptions(newValue ? [newValue, ...options] : options);
                setSelectedValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField {...params} label="Search a Product" variant="standard" fullWidth/>
            )}
            renderOption={(props, option) => {
                let key = ''
                let name = ''
                if (typeof option !== 'string') {
                    key = `${option.id}-${option.name}`
                    name = option.name
                } else {
                    key = option
                    key = name
                }

                return (
                    <li {...props} key={key}>
                        <Typography variant="body2" color="text.secondary">
                            {name}
                        </Typography>
                    </li>
                );
            }}
        />
    );
}