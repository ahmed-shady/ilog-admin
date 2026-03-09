export const selectStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: '38px',
    borderColor: '#ced4da',
    '&:hover': {
      borderColor: '#667eea'
    }
  }),

  multiValue: (base: any) => ({
    ...base,
    backgroundColor: '#e7f1ff',
    borderRadius: '4px'
  }),

  multiValueLabel: (base: any) => ({
    ...base,
    color: '#667eea',
    fontWeight: 500
  }),

  multiValueRemove: (base: any) => ({
    ...base,
    color: '#667eea',
    '&:hover': {
      backgroundColor: '#667eea',
      color: 'white'
    }
  }),

  menuList: (base: any) => ({
    ...base,
    maxHeight: '300px',
    zIndex: 10
  })
};