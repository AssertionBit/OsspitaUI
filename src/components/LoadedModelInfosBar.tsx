/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import './LoadedModelInfosBar.css'
import { OllamaService } from '../services/OllamaService'

export default function LoadedModelInfosBar(){

    const [runningModelsInfos, setRunningModelsInfos] = useState<IRunningModelInfos | null>(null)

    async function handleRefreshClick(){
        const runningModelsInfos = await OllamaService.getRunningModelInfos()
        if(runningModelsInfos?.models != null) {
            setRunningModelsInfos({
                name : runningModelsInfos.models[0].name,
                size : runningModelsInfos.models[0].size,
                percentageInVRAM : runningModelsInfos.models[0].size_vram / runningModelsInfos.models[0].size * 100,
                parameter_size : runningModelsInfos.models[0].details.parameter_size,
                quantization : runningModelsInfos.models[0].details.quantization_level,
            })
        }
    }

    return(
      <div className='topContainer'>
        <div className="infosBarContainer">
            <span className='label'>Model</span>
            <span className='value'>{ runningModelsInfos?.name || "N/A" }</span>
            <span className='label'>Allocation</span>
            <div className='allocationBarContainer'>
                <span style={{flexGrow:0}}>GPU</span>
                <div className='barContainer'>
                    <div style={{width : (runningModelsInfos?.percentageInVRAM || 0) * 1.2 }} className='bar'>
                      <span>{runningModelsInfos?.percentageInVRAM ? Math.floor(runningModelsInfos?.percentageInVRAM) + '%' : ""}</span>
                    </div>
                </div>
                <span style={{flexGrow:0}}>CPU</span>
            </div>
            <span className='label'>Size</span>
            <span className='value'>{ runningModelsInfos?.size ? (runningModelsInfos.size/1000000000).toFixed(2) + ' GB' : "N/A" }</span>
            <span className='label'>Quantization</span>
            <span className='value'>{ runningModelsInfos?.quantization || "N/A" }</span>
            <button onClick={handleRefreshClick}>
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 22C7.92917 22 5.32812 20.9344 3.19687 18.8031C1.06562 16.6719 0 14.0708 0 11C0 7.92917 1.06562 5.32812 3.19687 3.19687C5.32812 1.06562 7.92917 0 11 0C12.5812 0 14.0938 0.326333 15.5375 0.979C16.9813 1.63167 18.2188 2.56575 19.25 3.78125V1C19.25 0.447715 19.6977 0 20.25 0H21C21.5523 0 22 0.447715 22 1V8.625C22 9.17728 21.5523 9.625 21 9.625H13.375C12.8227 9.625 12.375 9.17728 12.375 8.625V7.875C12.375 7.32272 12.8227 6.875 13.375 6.875H18.15C17.4167 5.59167 16.4143 4.58333 15.1429 3.85C13.8715 3.11667 12.4905 2.75 11 2.75C8.70833 2.75 6.76042 3.55208 5.15625 5.15625C3.55208 6.76042 2.75 8.70833 2.75 11C2.75 13.2917 3.55208 15.2396 5.15625 16.8438C6.76042 18.4479 8.70833 19.25 11 19.25C12.7646 19.25 14.3573 18.7458 15.7781 17.7375C17.0037 16.8677 17.9139 15.7592 18.5086 14.412C18.6806 14.0224 19.0542 13.75 19.4801 13.75H20.3578C21.0139 13.75 21.4935 14.373 21.2579 14.9853C20.5366 16.8599 19.3631 18.4304 17.7375 19.6969C15.7667 21.2323 13.5208 22 11 22Z" fill="white"/>
                </svg>
            </button>
        </div>
      </div>
    )
}

// hover % allocation bar

interface IRunningModelInfos{
    name : string
    size : number
    percentageInVRAM : number
    parameter_size : string
    quantization : string
}

/*
{
  "models": [
    {
      "name": "mistral:latest",
      "model": "mistral:latest",
      "size": 5137025024,
      "digest": "2ae6f6dd7a3dd734790bbbf58b8909a606e0e7e97e94b7604e0aa7ae4490e6d8",
      "details": {
        "parent_model": "",
        "format": "gguf",
        "family": "llama",
        "families": [
          "llama"
        ],
        "parameter_size": "7.2B",
        "quantization_level": "Q4_0"
      },
      "expires_at": "2024-06-04T14:38:31.83753-07:00",
      "size_vram": 5137025024
    }
  ]
}
*/