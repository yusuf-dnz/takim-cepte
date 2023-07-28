import { View, Text, InputAccessoryView, TextInput } from 'react-native'
import React from 'react'
import { List } from 'react-native-paper';


export default function EventListAccordion() {
    const [expanded, setExpanded] = React.useState(true);

    const handlePress = () => setExpanded(!expanded);

    return (
        <View>

            <List.Section>
                <List.Accordion
                    description="Etkinlik Ekle"
                    title="Topluluk"
                    left={props => <List.Icon {...props} icon="earth" />}>
                    <List.Item title="First item" />
                    <List.Item title="Second item" />
                </List.Accordion>
                
                {/* <List.Accordion
                    title="Controlled Accordion"
                    left={props => <List.Icon {...props} icon="folder" />}
                    expanded={expanded}
                    onPress={handlePress}>
                    <List.Item title="First item" />
                    <List.Item title="Second item" />
                </List.Accordion> */}
            </List.Section>
            
        </View>
    )
}