/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import './RightPanel3.css'
import { AIAgent } from '../models/AIAgent'
import IFormStructure from '../interfaces/IAgentFormStructure'
import { AgentLibrary } from '../services/AgentLibrary'
import Select, { IOption } from './CustomSelect/Select'
import { ChatService } from '../services/ChatService'
import userPicture from '../assets/usericon4-2.png'
import React from 'react'
import AgentService from '../services/AgentService'
import useFetchModelsList from '../hooks/useFetchModelsList'

const RightPanel = React.memo(({memoizedSetModalStatus} : IProps) => {

    // retrieved for the ollama api
    const modelsList = useFetchModelsList()

    useEffect(() => {console.log("right panel render")}) 

    const [webSearchEconomy, setWebSearchEconomy] = useState(true)
    const currentAgent = useRef<AIAgent>(ChatService.getActiveAgent())

    const currentFormValues : IFormStructure = {
        agentName: currentAgent.current.getName(),
        modelName: currentAgent.current.getModelName(),
        systemPrompt: currentAgent.current.getSystemPrompt().replace(/\t/g,''),
        temperature: currentAgent.current.getTemperature(),
        maxContextLength: currentAgent.current.getContextSize(),
        maxTokensPerReply: currentAgent.current.getNumPredict(),
        webSearchEconomy: true,
    }

    const [formValues, setFormValues] = useState<IFormStructure>(currentFormValues)
    
    const [showSavingSuccessfulBtn, setShowSavingSuccessfulBtn] = useState<boolean>(false)
    const timeoutRef = useRef<null | NodeJS.Timeout>(null)


    // the multiple renders on save are due to the multiple graphical states of the save button
    function handleSaveAgent(e : React.MouseEvent<HTMLButtonElement>){
        e.preventDefault()

        const newAgent = new AIAgent(ChatService.getActiveAgent().getName(), formValues.modelName)
        .setContextSize(formValues.maxContextLength)
        .setNumPredict(formValues.maxTokensPerReply)
        .setSystemPrompt(formValues.systemPrompt)
        .setTemperature(formValues.temperature)

        // update the offline library
        AgentLibrary.updateAgent(newAgent)
        // update the backend db !!! isAPIoffline?
        AgentService.update(newAgent)
        // make sure that the chat active agent is now the updated agent
        ChatService.setActiveAgent(newAgent.getName())

        setShowSavingSuccessfulBtn(true)
    }

    // switch active agent
    function handleSwitchAgent(option : IOption){
        ChatService.setActiveAgent(option.value)
        const agent = ChatService.getActiveAgent()
        const newFormValues : IFormStructure = {
            agentName: agent.getName(),
            modelName: agent.getModelName(),
            systemPrompt: agent.getSystemPrompt().replace(/\t/g,''),
            temperature: agent.getTemperature(),
            maxContextLength: agent.getContextSize(),
            maxTokensPerReply: agent.getNumPredict(),
            webSearchEconomy: true,
        }
        setFormValues({...newFormValues})
    }

    // switch active model
    function handleSwitchModel(option : IOption){
        setFormValues(currentFormValues => ({...currentFormValues, modelName: option.value}))
    }

    // edit agent
    function handleOpenEditAgentFormClick(){
        memoizedSetModalStatus({visibility : true, contentId : "formEditAgent"})
    }

    // create new agent
    function handleOpenNewAgentFormClick(){
        memoizedSetModalStatus({visibility : true, contentId : "formNewAgent"})
    }

    // save button animation
    useEffect(() => {
        if(!showSavingSuccessfulBtn) return
        timeoutRef.current = setTimeout(() => setShowSavingSuccessfulBtn(false), 2500)
        return () => {
            if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            }
        }     
    }, [showSavingSuccessfulBtn])

    return(
        <aside className="rightDrawer">
            <div className='userSettingsContainer'>
                <span style={{marginLeft:'36px', fontSize:'15px'}}>
                    <a href="https://ollama.com/library?sort=newest" target="_blank">Check the latest Models for Ollama</a>
                </span>
                <img src={userPicture}/>
            </div>
            <article className='newAgentContainer'>
                <button className='purpleShadow' onClick={handleOpenNewAgentFormClick}>+ Create a New Agent</button>
            </article>
            <article className='settingsFormContainer'>
                <label id="label-agentName">Agent Powering the Chat</label>
                <Select 
                    width="100%"
                    options={/* !!!! retrieve from db */ AgentLibrary.getAgentsNameList().map((agentName) => ({ label: agentName, value: agentName }))} 
                    defaultOption={formValues.agentName}
                    labelledBy="label-agentName" 
                    id="settingsSelectAgent"
                    onValueChange={handleSwitchAgent}
                />
                <label id="label-modelName">Model</label>
                <Select 
                    width="100%"
                    options={modelsList.map((model) => ({ label: model, value: model }))} 
                    defaultOption={formValues.modelName}
                    labelledBy="label-modelName" 
                    id="settingsSelectModel"
                    onValueChange={handleSwitchModel}
                />
                <label>SystemPrompt</label>
                <div className='systemPromptContainer'>
                    <input 
                        spellCheck="false"
                        readOnly
                        type="text" 
                        value={formValues.systemPrompt.length > 37 ? formValues.systemPrompt.substring(0, 34)+'...' : formValues.systemPrompt}
                    />
                    <button className='purpleShadow' onClick={handleOpenEditAgentFormClick}>
                        <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.9984 5.76357C21.9992 5.61882 21.9715 5.47532 21.9167 5.34131C21.862 5.2073 21.7813 5.08541 21.6794 4.98263L17.0157 0.318979C16.913 0.217037 16.7911 0.136386 16.6571 0.0816487C16.5231 0.0269117 16.3796 -0.000833794 16.2348 3.12556e-06C16.0901 -0.000833794 15.9466 0.0269117 15.8125 0.0816487C15.6785 0.136386 15.5566 0.217037 15.4539 0.318979L12.3411 3.43175L0.318995 15.4538C0.217053 15.5566 0.136401 15.6785 0.0816639 15.8125C0.026927 15.9465 -0.000818536 16.09 1.83843e-05 16.2348V20.8984C1.83843e-05 21.1902 0.115902 21.4699 0.322177 21.6762C0.528451 21.8825 0.80822 21.9984 1.09994 21.9984H5.76359C5.9175 22.0067 6.07145 21.9827 6.21546 21.9277C6.35946 21.8728 6.49032 21.7882 6.59953 21.6794L18.5556 9.65728L21.6794 6.59951C21.7796 6.49278 21.8614 6.37011 21.9214 6.23654C21.932 6.14886 21.932 6.06023 21.9214 5.97256C21.9265 5.92136 21.9265 5.86977 21.9214 5.81857L21.9984 5.76357ZM5.31262 19.7985H2.19985V16.6858L13.122 5.76357L16.2348 8.87634L5.31262 19.7985ZM17.7857 7.32546L14.6729 4.21269L16.2348 2.6618L19.3366 5.76357L17.7857 7.32546Z" fill="white"/>
                        </svg>
                    </button>
                </div>
                <label>Temperature</label>
                <div className='temperatureContainer'>
                    <input 
                        spellCheck="false" 
                        type="number"
                        step="0.01" min="0" max="1" 
                        value={formValues.temperature}
                        onChange={(e) => setFormValues(formValues => ({...formValues, temperature : e.target.value === '' ? 0 : parseFloat(e.target.value)}))}
                    />
                    <figure title="0 : Predictable <-> 1 : Creative" data-tooltip="Predictable <-> Creative">
                        <svg style={{transform:'translateX(0.5px) translateY(0.5px)'}} width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M9.40629 1.71324H24V3.42702H10.1991C10.2567 3.70901 10.2857 3.99609 10.2857 4.2839V13.8039C11.1126 14.6476 11.6719 15.7165 11.8935 16.8767C12.1151 18.0368 11.9892 19.2366 11.5315 20.3255C11.0738 21.4143 10.3047 22.3439 9.32069 22.9976C8.33665 23.6513 7.18148 24 6 24C4.81853 24 3.66335 23.6513 2.67932 22.9976C1.69529 22.3439 0.926207 21.4143 0.468513 20.3255C0.0108194 19.2366 -0.115114 18.0368 0.106505 16.8767C0.328123 15.7165 0.887429 14.6476 1.71429 13.8039V4.2839C1.71134 3.38597 1.99162 2.50997 2.51529 1.78044C3.03897 1.0509 3.77937 0.504982 4.63123 0.22029C5.4831 -0.0644014 6.40306 -0.0733719 7.26031 0.194654C8.11757 0.462681 8.86848 0.994061 9.40629 1.71324ZM3.56976 21.5261C4.28481 22.0174 5.13235 22.2798 6 22.2785C6.86765 22.2798 7.71519 22.0174 8.43024 21.5261C9.1453 21.0348 9.69408 20.3378 10.0038 19.5275C10.3136 18.7173 10.3697 17.8321 10.1647 16.9893C9.95972 16.1464 9.50331 15.3858 8.856 14.8082L8.57143 14.552V4.2839C8.57143 3.60212 8.30051 2.94826 7.81828 2.46617C7.33604 1.98408 6.68199 1.71324 6 1.71324C5.31802 1.71324 4.66396 1.98408 4.18173 2.46617C3.69949 2.94826 3.42857 3.60212 3.42857 4.2839V14.552L3.144 14.8082C2.4967 15.3858 2.04029 16.1464 1.83529 16.9893C1.6303 17.8321 1.6864 18.7173 1.99616 19.5275C2.30592 20.3378 2.85471 21.0348 3.56976 21.5261ZM21.4288 6.85456H15.4288V8.56834H21.4288V6.85456ZM24.0002 11.9959H15.4288V13.7097H24.0002V11.9959ZM21.4288 17.1372H15.4288V18.851H21.4288V17.1372ZM6.85738 4.2839V15.5811C7.42927 15.7832 7.91128 16.181 8.2182 16.704C8.52513 17.2271 8.63721 17.8418 8.53463 18.4394C8.43205 19.0371 8.12143 19.5793 7.65766 19.9702C7.19388 20.361 6.60682 20.5754 6.00023 20.5754C5.39364 20.5754 4.80658 20.361 4.34281 19.9702C3.87904 19.5793 3.56841 19.0371 3.46584 18.4394C3.36326 17.8418 3.47534 17.2271 3.78226 16.704C4.08919 16.181 4.57119 15.7832 5.14309 15.5811V4.2839H6.85738Z" fill="black"/>
                        </svg>
                    </figure>
                </div>
                <label>Context Length</label>
                <div className='contextContainer'>
                    <input 
                        spellCheck="false" 
                        type="number"
                        step="1" min="0" max="1000000" 
                        value={formValues.maxContextLength}
                        onChange={(e) => setFormValues(formValues => ({...formValues, maxContextLength : e.target.value === '' ? 0 : parseInt(e.target.value)}))}
                    />
                    <figure title="Amount of Tokens considered during Inference" data-tooltip="Amount of Tokens considered during Inference">
                        <svg width="24" height="24" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.6667 8H9.33333C8.6 8 8 8.6 8 9.33333V16.6667C8 17.4 8.6 18 9.33333 18H16.6667C17.4 18 18 17.4 18 16.6667V9.33333C18 8.6 17.4 8 16.6667 8ZM16 16H10V10H16V16ZM26 10.3333C26 9.6 25.4 9 24.6667 9H22.3333V6.33333C22.3333 4.86667 21.1333 3.66667 19.6667 3.66667H17V1.33333C17 0.6 16.4 0 15.6667 0C14.9333 0 14.3333 0.6 14.3333 1.33333V3.66667H11.6667V1.33333C11.6667 0.6 11.0667 0 10.3333 0C9.6 0 9 0.6 9 1.33333V3.66667H6.33333C4.86667 3.66667 3.66667 4.86667 3.66667 6.33333V9H1.33333C0.6 9 0 9.6 0 10.3333C0 11.0667 0.6 11.6667 1.33333 11.6667H3.66667V14.3333H1.33333C0.6 14.3333 0 14.9333 0 15.6667C0 16.4 0.6 17 1.33333 17H3.66667V19.6667C3.66667 21.1333 4.86667 22.3333 6.33333 22.3333H9V24.6667C9 25.4 9.6 26 10.3333 26C11.0667 26 11.6667 25.4 11.6667 24.6667V22.3333H14.3333V24.6667C14.3333 25.4 14.9333 26 15.6667 26C16.4 26 17 25.4 17 24.6667V22.3333H19.6667C21.1333 22.3333 22.3333 21.1333 22.3333 19.6667V17H24.6667C25.4 17 26 16.4 26 15.6667C26 14.9333 25.4 14.3333 24.6667 14.3333H22.3333V11.6667H24.6667C25.4 11.6667 26 11.0667 26 10.3333ZM19.3333 20.6667H6.66667C5.93333 20.6667 5.33333 20.0667 5.33333 19.3333V6.66667C5.33333 5.93333 5.93333 5.33333 6.66667 5.33333H19.3333C20.0667 5.33333 20.6667 5.93333 20.6667 6.66667V19.3333C20.6667 20.0667 20.0667 20.6667 19.3333 20.6667Z" fill="black"/>
                        </svg>
                    </figure>
                </div>
                <label>Max Tokens Per Reply</label>
                <div className='maxTokensContainer'>
                    <input
                        spellCheck="false"
                        type="number"
                        value={formValues.maxTokensPerReply}
                        onChange={(e) => setFormValues(formValues => ({...formValues, maxTokensPerReply : e.target.value === '' ? 0 : parseInt(e.target.value)}))}
                    />
                    <figure>
                        <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M22 14.6667V20.7778C22 21.1019 21.8712 21.4128 21.642 21.642C21.4128 21.8712 21.1019 22 20.7778 22H14.6667V19.5556H19.5556V14.6667H22ZM7.33333 0V2.44444H2.44444V7.33333H0V1.22222C0 0.898069 0.128769 0.587192 0.357981 0.357981C0.587192 0.128769 0.898069 0 1.22222 0H7.33333ZM17.8249 2.44444H14.6667V0H20.7778C21.1019 0 21.4128 0.128769 21.642 0.357981C21.8712 0.587192 22 0.898069 22 1.22222V7.33333H19.5556V4.17267L14.2193 9.50644L12.4911 7.77822L17.8249 2.44444ZM4.17511 19.5531H7.33333V21.9976H1.22222C0.898069 21.9976 0.587192 21.8688 0.357981 21.6396C0.128769 21.4104 0 21.0995 0 20.7753V14.6642H2.44444V17.8261L7.78067 12.4911L9.50889 14.2193L4.17511 19.5531Z" fill="black"/>
                        </svg>
                    </figure>
                </div>
                <label>Web Search</label>
                <div className='webSearchContainer'>
                    <span>Context Economy</span>
                    <div className='switchContainer' onClick={() => setWebSearchEconomy(webSearchEconomy => !webSearchEconomy)}>
                        <div className={webSearchEconomy ? 'switch active' : 'switch'}></div>
                    </div>
                    <span>Processing Speed</span>
                </div>
                <div className='settingsSaveContainer'>
                    <button className='more purpleShadow' onClick={handleOpenEditAgentFormClick}>More Settings</button>
                    {
                        !showSavingSuccessfulBtn ? <button className='save purpleShadow' onClick={handleSaveAgent}>Save</button>
                        :<button className='save purpleShadow'>
                            <svg className='checkmarkSVG' viewBox='0 0 100 100'>
                                <path className='checkmarkIcon' d='M 25 50 L 43 68 L 75 32'/>
                            </svg>
                        </button>
                    }
                </div>
            </article>
        </aside>
    )
}/*, (prevProps, nextProps) => {
    // refresh only when modelsList state change
    return prevProps.modelsList === nextProps.modelsList
}*/)

export default RightPanel

interface IProps{
    // currentAgent : AIAgent
    memoizedSetModalStatus : ({visibility, contentId} : {visibility : boolean, contentId? : string}) => void
    /*modelsList : string[]*/
    // setCurrentAgent : React.Dispatch<React.SetStateAction<AIAgent>>
}