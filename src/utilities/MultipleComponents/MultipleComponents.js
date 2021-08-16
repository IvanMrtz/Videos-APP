export default function({section, children: sections}) {
    const actualSection = sections.filter(SectionComponent => {
        if(SectionComponent.props.section === section){
            return true;
        }else{
            return false;
        }
    })[0];

    return actualSection.props.render();
}