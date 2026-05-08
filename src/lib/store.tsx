import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from './supabase';

export type StepStatus = 'pending' | 'generating' | 'completed';

export interface Step {
    id: string;
    title: string;
    description: string;
    status: StepStatus;
    content?: string; // HTML or Markdown content
    image?: string; // For brand kit
}

interface AppState {
    user: any | null;
    projectId: string | null;
    businessIdea: string;
    location: string;
    steps: Step[];
    isLoading: boolean;
    initProject: (idea: string, loc: string) => Promise<string | null>;
    updateStepStatus: (id: string, status: StepStatus) => void;
    updateStepContent: (id: string, content: string, image?: string) => Promise<void>;
    loadProject: (id: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const defaultSteps: Step[] = [
    { id: 'executive-summary', title: 'Executive Summary', description: 'Overview of your business.', status: 'pending' },
    { id: 'market-research', title: 'Market Research', description: 'Analysis of market trends and competitors.', status: 'pending' },
    { id: 'target-audience', title: 'Target Audience', description: 'Define your buyer persona.', status: 'pending' },
    { id: 'marketing-plan', title: 'Marketing Plan', description: 'Strategies to reach your customers.', status: 'pending' },
    { id: 'financial-plan', title: 'Financial Plan', description: 'Revenue projections and costs.', status: 'pending' },
    { id: 'brand-kit', title: 'Brand Identity', description: 'Logo, colors, and visual style.', status: 'pending' },
];

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [projectId, setProjectId] = useState<string | null>(null);
    const [businessIdea, setBusinessIdea] = useState('');
    const [location, setLocation] = useState('');
    const [steps, setSteps] = useState<Step[]>(defaultSteps);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Escuchar cambios en la sesión
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setProjectId(null);
        setBusinessIdea('');
        setLocation('');
        setSteps(defaultSteps);
    };

    const initProject = async (idea: string, loc: string) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('projects')
                .insert([{ 
                    business_idea: idea, 
                    location: loc,
                    user_id: user?.id // Vincular al usuario actual
                }])
                .select()
                .single();

            if (error) throw error;

            setProjectId(data.id);
            setBusinessIdea(idea);
            setLocation(loc);
            return data.id;
        } catch (error) {
            console.error('Error creating project:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const loadProject = async (id: string) => {
        setIsLoading(true);
        try {
            const { data: project, error: pError } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single();

            if (pError) throw pError;

            const { data: dbSteps, error: sError } = await supabase
                .from('steps')
                .select('*')
                .eq('project_id', id);

            if (sError) throw sError;

            setProjectId(project.id);
            setBusinessIdea(project.business_idea);
            setLocation(project.location);

            if (dbSteps) {
                setSteps(prev => prev.map(s => {
                    const dbStep = dbSteps.find(ds => ds.step_key === s.id);
                    return dbStep ? {
                        ...s,
                        status: dbStep.status as StepStatus,
                        content: dbStep.content,
                        image: dbStep.image_url
                    } : s;
                }));
            }
        } catch (error) {
            console.error('Error loading project:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStepStatus = (id: string, status: StepStatus) => {
        setSteps(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    };

    const updateStepContent = async (id: string, content: string, image?: string) => {
        if (!projectId) return;

        // Optimistic update
        setSteps(prev => prev.map(s => s.id === id ? { ...s, content, image, status: 'completed' } : s));

        try {
            const { error } = await supabase
                .from('steps')
                .upsert({
                    project_id: projectId,
                    step_key: id,
                    status: 'completed',
                    content,
                    image_url: image
                }, { onConflict: 'project_id,step_key' });

            if (error) throw error;
        } catch (error) {
            console.error('Error saving step:', error);
        }
    };

    return (
        <AppContext.Provider value={{
            user,
            projectId,
            businessIdea,
            location,
            steps,
            isLoading,
            initProject,
            updateStepStatus,
            updateStepContent,
            loadProject,
            signOut
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppStore = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppStore must be used within an AppProvider');
    return context;
};
