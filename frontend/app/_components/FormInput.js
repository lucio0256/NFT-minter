import { Control, Controller, FieldValue, FieldValues  } from 'react-hook-form';
import { Input } from '@nextui-org/input';


export default function FormInput({ name, ...props }) {
    return (
        <Controller 
            name={name}
            control={props.control}
            rules={props.rules}
            defaultValue=""
            render={({ field, fieldState, formState }) => (
                <Input
                    {...props}
                    type={props.type}
                    isInvalid={!!formState.errors?.[name]?.message}
                    errorMessage={formState.errors?.[name]?.message?.toString()}
                    value={field.value}
                    onChange={field.onChange} 
                />
            )}
        
        />
    )
    
}