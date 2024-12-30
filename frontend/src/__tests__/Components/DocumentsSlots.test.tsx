import { MemoryRouter } from 'react-router-dom';
import '@testing-library/react/dont-cleanup-after-each'
import Chat from '../../pages/Chat';
import { OllamaService } from '../../services/OllamaService';
import { render, screen, waitFor, act, cleanup } from '@testing-library/react';
import {describe, beforeEach, vi, expect, test, afterEach } from 'vitest';
import '@testing-library/react/dont-cleanup-after-each'
import mockModelsList from '../../__mocks__/mockModelsList';
import mockAgentsList from '../../__mocks__/mockAgentsList';
import DocService from '../../services/API/DocService';
import mockRAGDocumentsList from '../../__mocks__/mockRAGDocumentsList';
import PromptService from '../../services/API/PromptService';
import mockPromptsList from '../../__mocks__/mockPromptsList';
import mockRunningModelsInfos from '../../__mocks__/mockRunningModelsInfos';
import AgentService from '../../services/API/AgentService';

const MockedRouter = () => (
    <MemoryRouter>
      <Chat />
    </MemoryRouter>
);

const mockVoices = [
    { name: 'Voice 1', lang: 'en-US' },
    { name: 'Voice 2', lang: 'es-ES' },
];

describe('Given I am on the Chat page', () => {
    beforeEach(() => {
        HTMLDialogElement.prototype.show = vi.fn()
        HTMLDialogElement.prototype.showModal = vi.fn()
        HTMLDialogElement.prototype.close = vi.fn()
        vi.spyOn(OllamaService, 'getModelList').mockResolvedValue(mockModelsList)
        vi.spyOn(OllamaService, 'getRunningModelInfos').mockResolvedValue(mockRunningModelsInfos)
        vi.spyOn(AgentService.prototype, 'getAll').mockResolvedValue(mockAgentsList)
        vi.spyOn(AgentService.prototype, 'getAgentByName').mockResolvedValue(mockAgentsList[0])
        vi.spyOn(DocService, 'getAll').mockResolvedValue(mockRAGDocumentsList)
        vi.spyOn(PromptService.prototype, 'getAll').mockResolvedValue(mockPromptsList)
        vi.stubGlobal('speechSynthesis', {
            getVoices: vi.fn().mockReturnValue(mockVoices),
        });
        render(<MockedRouter />)
    });

    afterEach(() => {
        vi.resetAllMocks()
        cleanup()
    })

    test('Can navigate between RAG Documents', async () => {
        await waitFor(() => expect(screen.getByText(/OSSPITA FOR/i)).toBeInTheDocument())
        expect(screen.getByText(/dracula/i)).toBeInTheDocument()
        expect(screen.getByText(/montecristo/i)).toBeInTheDocument()
        expect(screen.getByText(/sota/i)).toBeInTheDocument()
        expect(screen.getByText(/mockFile1/i)).toBeInTheDocument()
        expect(screen.queryByText(/mockFile2/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/mockFile3/i)).not.toBeInTheDocument()

        const previousPages = screen.getAllByTitle("previous page")
        const nextPages = screen.getAllByTitle("next page")

        act(() => nextPages[1].click())
        await waitFor(() => expect(screen.getByText(/mockFile2/i)).toBeInTheDocument())
        await waitFor(() => expect(screen.getByText(/mockFile3/i)).toBeInTheDocument())
        expect(screen.queryByText(/dracula/i)).not.toBeInTheDocument()

        act(() => previousPages[1].click())
        await waitFor(() => expect(screen.getByText(/dracula/i)).toBeInTheDocument())
        expect(screen.queryByText(/mockFile2/i)).not.toBeInTheDocument()
    })
})