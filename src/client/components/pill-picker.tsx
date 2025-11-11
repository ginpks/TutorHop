import React, { useRef } from "react";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useAutocomplete } from "@mui/material";

// this should prob be in some global const lol
const palette = {
  bg: "#FBFFF1",
  light: "#B4C5E4",
  light2: "#3D52D5",
  dark: "#090C9B",
  text: "#3C3744",
  placeholder: "#999",
};

function mergeRefs(...refs: any[]) {
  return (value: any) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") ref(value);
      else if (ref) ref.current = value;
    });
  };
}

const Label = styled("label")({
  marginBottom: 6,
  fontSize: "14px",
  color: palette.text,
  display: "block",
});

const InputWrapper = styled("div")<{ focused?: boolean }>(({ focused }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  padding: "4px 8px",
  minHeight: "40px",
  border: `2px solid ${focused ? palette.dark : palette.light}`,
  borderRadius: "8px",
  transition: "border-color 0.2s ease",
  backgroundColor: palette.bg,
  "&:hover": {
    borderColor: palette.dark,
  },
  "& input": {
    border: 0,
    outline: 0,
    flexGrow: 1,
    minWidth: "80px",
    padding: "6px",
    fontSize: "14px",
    color: palette.text,
    background: "transparent",
    "&::placeholder": {
      color: palette.placeholder,
      opacity: 1,
    },
  },
}));

const Tag = styled("div")({
  display: "flex",
  alignItems: "center",
  backgroundColor: palette.light,
  color: palette.text,
  borderRadius: "20px",
  padding: "4px 10px",
  margin: "4px",
  fontSize: "14px",
  transition: "background-color 0.2s ease, color 0.2s ease",
  "&:hover": {
    backgroundColor: palette.light2,
    color: "#fff",
  },
  "& svg": {
    fontSize: "16px",
    marginLeft: "6px",
    cursor: "pointer",
    color: palette.text,
    transition: "color 0.15s ease, transform 0.15s ease",
  },
  "&:hover svg": {
    color: "#fff",
    transform: "scale(1.15)",
  },
});

const Listbox = styled("ul")({
  zIndex: 10,
  listStyle: "none",
  margin: "4px 0 0 0",
  padding: 0,
  maxHeight: 180,
  overflow: "auto",
  backgroundColor: palette.bg,
  border: `1px solid ${palette.light}`,
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",

  scrollbarWidth: "thin",
  scrollbarColor: "transparent transparent",

  "&::-webkit-scrollbar": {
    width: 6,
    height: 6,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "transparent",
    borderRadius: 3,
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },

  "&:hover": {
    scrollbarColor: `${palette.light2} transparent`,
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: palette.light2,
    },
  },

  "& li": {
    padding: "8px 12px",
    cursor: "pointer",
    color: palette.text,
  },
  '& li[aria-selected="true"]': {
    backgroundColor: palette.light,
  },
  '& li[data-focus="true"]': {
    backgroundColor: palette.light2,
    color: "#fff",
  },
});

export default function PillPicker({
  label = "",
  options,
  value,
  onChange,
  placeholder = "",
}: {
  label?: string;
  options: string[];
  value: string[];
  onChange: (newValue: string[]) => void;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
  } = useAutocomplete({
    id: "class-selector",
    multiple: true,
    options,
    value,
    onChange: (_, newValue) => onChange(newValue as string[]),
    getOptionLabel: (option) => String(option),
  });

  const handleDelete = (idx: number) => {
    const next = [...value];
    next.splice(idx, 1);
    onChange(next);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === "Backspace" &&
      !event.currentTarget.value &&
      value.length > 0
    ) {
      onChange(value.slice(0, -1));
    }
  };

  const inputProps = getInputProps();

  return (
    <div {...getRootProps()}>
      <Label>{label}</Label>

      <InputWrapper focused={focused}>
        {value.map((option, index) => (
          <Tag key={option + "-" + index}>
            {option}
            <CloseIcon onClick={() => handleDelete(index)} />
          </Tag>
        ))}
        <input
          {...inputProps}
          placeholder={value.length === 0 ? placeholder : ""}
          ref={mergeRefs(inputRef, inputProps.ref)}
          onKeyDown={handleKeyDown}
          style={{ color: palette.text }}
        />
      </InputWrapper>

      {groupedOptions.length > 0 && (
        <Listbox {...getListboxProps()}>
          {(groupedOptions as string[]).map((option, index) => (
            <li
              {...getOptionProps({ option, index })}
              key={option + "-" + index}
            >
              {option}
            </li>
          ))}
        </Listbox>
      )}
    </div>
  );
}
