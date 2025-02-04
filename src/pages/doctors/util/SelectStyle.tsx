export default (() => ({
    control: (base: any) => ({
      ...base,
      boxShadow: "none",
      //height: "58px",
      borderRadius: "10px",
      "&:hover": {
        borderColor: "#44B9CB",
        boxShadow: "0 0 0 0.25rem rgba(68, 165, 203, 0.25)"
      },
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 99999 }),
    option: (base: any, config: any) => ({
      ...base,
      color: config.isFocused || config.isSelected ? "white" : "black",
      backgroundColor: config.isFocused || config.isSelected ? "#44B9CB" : null,
    }),
    indicatorSeparator: (base: any) => ({...base, display:'none'}),
    clearIndicator: (base: any) => ({...base, padding: '4px', display: 'none'}),
    dropdownIndicator: (base: any) => ({...base, padding: '4px'})
  }))();