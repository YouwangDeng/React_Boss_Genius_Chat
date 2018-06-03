import React from 'react'
export default function imoocForm(Comp) {

    return class Wrapper extends React.Component{
        constructor(props){
            super(props)
            this.state = {}
            this.handleChange=this.handleChange.bind(this)
        }
        handleChange(key, value) {
            this.setState({
                [key]: value
            })
        }
        render() {
            return <Comp handleChange={this.handleChange} {...this.props} state={this.state}></Comp>
        }
    }
}