import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from './supabase';

export type StepStatus = 'pending' | 'generating' | 'completed';

export interface Step {
    id: string;
    title: string;
    description: string;
    status: StepStatus;
    content?: string;
}

interface AppState {
    businessIdea: string;
    location: string;
    steps: Step[];
    isLoading: boolean;
    user: any;
    initProject: (idea: string, loc: string) => Promise<string | null>;
    fetchProject: (id: string) => Promise<void>;
    updateStepStatus: (stepId: string, status: StepStatus, content?: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const initialSteps: Step[] = [
    { id: '1', title: 'Resumen Ejecutivo', description: 'Visión general del negocio.', status: 'pending', content: '' },
    { id: '2', title: 'Análisis de Mercado', description: 'Industria y competencia.', status: 'pending', content: '' },
    { id: '3', title: 'Estrategia de Marketing', description: 'Atracción de clientes.', status: 'pending', content: '' },
    { id: '4', title: 'Plan Operativo', description: 'Logística y equipo.', status: 'pending', content: '' },
    { id: '5', title: 'Identidad de Marca', description: 'Valores y guía visual.', status: 'pending', content: '' },
    { id: '6', title: 'Plan Financiero', description: 'Proyecciones de ingresos.', status: 'pending', content: '' }
];

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [businessIdea, setBusinessIdea] = useState('');
    const [location, setLocation] = useState('');
    const [steps, setSteps] = useState<Step[]>(initialSteps);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const initProject = useCallback(async (idea: string, loc: string) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('projects')
                .insert([{ business_idea: idea, location: loc, user_id: user?.id }])
                .select()
                .single();

            if (error) throw error;

            setBusinessIdea(idea);
            setLocation(loc);
            
            const projectSteps = initialSteps.map(s => ({
                project_id: data.id,
                title: s.title,
                description: s.description,
                status: 'pending',
                content: ''
            }));

            const { error: stepsError } = await supabase.from('steps').insert(projectSteps);
            if (stepsError) throw stepsError;

            return data.id;
        } catch (error) {
            console.error(error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const fetchProject = useCallback(async (id: string) => {
        setIsLoading(true);
        try {
            const { data: project } = await supabase.from('projects').select('*').eq('id', id).single();
            if (project) {
                setBusinessIdea(project.business_idea);
                setLocation(project.location);
            }

            const { data: projectSteps } = await supabase.from('steps').select('*').eq('project_id', id).order('id');
            if (projectSteps) {
                setSteps(projectSteps);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateStepStatus = useCallback(async (stepId: string, status: StepStatus, content?: string) => {
        try {
            const { error } = await supabase
                .from('steps')
                .update({ status, content })
                .eq('id', stepId);

            if (error) throw error;

            setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status, content: content || s.content } : s));
        } catch (error) {
            console.error(error);
        }
    }, []);

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
    }, []);

    return (
        <AppContext.Provider value={{ 
            businessIdea, location, steps, isLoading, user, 
            initProject, fetchProject, updateStepStatus, signOut 
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppStore = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppStore must be used within AppProvider');
    return context;
};
